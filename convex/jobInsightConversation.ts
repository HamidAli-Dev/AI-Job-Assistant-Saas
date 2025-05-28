import { ConvexError, v } from "convex/values";
import { mutation, query, internalAction } from "./_generated/server";
import { CREDIT_COST } from "@/lib/api-limits";
import { Id } from "./_generated/dataModel";
import { JobInsightStatus, Role } from "@/lib/constants";
import { api, internal } from "./_generated/api";
import { getJobInsightConversationPrompt } from "@/lib/prompt";
import { chatSession } from "@/lib/gemini-ai";

export const createConversation = mutation({
  args: {
    userId: v.string(),
    jobId: v.id("jobs"),
    text: v.string(),
    role: v.union(v.literal(Role.USER), v.literal(Role.AI)),
    status: v.union(
      v.literal(JobInsightStatus.PENDING),
      v.literal(JobInsightStatus.COMPLETED),
      v.literal(JobInsightStatus.FAILED)
    ),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("jobInsightConversations", {
      userId: args.userId,
      jobId: args.jobId,
      text: args.text,
      role: args.role,
      status: args.status || JobInsightStatus.COMPLETED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const sendUserMessage = mutation({
  args: {
    userId: v.string(),
    jobId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const apiLimits = await ctx.db
      .query("apiLimits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!apiLimits || apiLimits.credits < CREDIT_COST.JOB_CHAT_MESSAGE) {
      throw new ConvexError({
        type: "INSUFFICIENT_CREDITS",
        message: "You have run out of credits.",
        require: CREDIT_COST.JOB_CHAT_MESSAGE,
        available: apiLimits?.credits || 0,
      });
    }

    const job = await ctx.db.get(args.jobId as Id<"jobs">);
    if (!job) {
      throw new ConvexError("Job not found.");
    }

    const conversationId = await ctx.db.insert("jobInsightConversations", {
      userId: args.userId,
      jobId: args.jobId as Id<"jobs">,
      text: args.message,
      role: Role.USER,
      status: JobInsightStatus.COMPLETED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Schedule AI response
    await ctx.scheduler.runAfter(
      0,
      internal.jobInsightConversation.generateAIJobInsightResponse,
      {
        jobId: job._id,
        userId: job.userId,
        userMessage: args.message,
        job: {
          jobTitle: job.jobTitle,
          processedDescription: job.processedDescription,
        },
      }
    );

    return conversationId;
  },
});

export const getMessagesByJobId = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.id) {
      return {
        data: null,
        success: false,
        message: "JobId is required",
      };
    }

    const messages = await ctx.db
      .query("jobInsightConversations")
      .withIndex("by_job", (q) => q.eq("jobId", args.id as Id<"jobs">))
      .collect();
    return { data: messages, success: true };
  },
});

export const generateAIJobInsightResponse = internalAction({
  args: {
    userId: v.string(),
    jobId: v.id("jobs"),
    userMessage: v.string(),
    job: v.any(),
  },
  handler: async (ctx, args) => {
    const jobData = {
      jobTitle: args.job.title,
      processedDescription: args.job.processedDescription,
    };

    // History of conversations
    const [history, responseId] = await Promise.all([
      ctx.runQuery(api.jobInsightConversation.getConversationHistory, {
        jobId: args.jobId,
        limit: 6,
      }),
      ctx.runMutation(api.jobInsightConversation.createConversation, {
        userId: args.userId,
        jobId: args.jobId,
        text: "...",
        role: Role.AI,
        status: JobInsightStatus.PENDING,
      }),
    ]);

    const prompt = getJobInsightConversationPrompt(
      jobData.jobTitle || "",
      jobData.processedDescription || "",
      args.userMessage,
      history?.map((item) => ({
        content: item.text,
        role: item.role === Role.USER ? "user" : "model",
        timestamp: new Date(item.createdAt).toISOString(),
      }))
    );

    const stream = await chatSession.sendMessageStream({ message: prompt });
    let fullResponse = "";
    let lastUpdateTime = Date.now();

    for await (const chunk of stream) {
      fullResponse += chunk.text;

      const currentTime = Date.now();
      if (currentTime - lastUpdateTime > 100 || chunk?.text?.includes(".")) {
        //update job con
        await ctx.runMutation(api.jobInsightConversation.updateConversation, {
          id: responseId,
          text: fullResponse + " ...",
          status: JobInsightStatus.PENDING,
        });
        lastUpdateTime = currentTime;
      }
    }

    await ctx.runMutation(api.jobInsightConversation.updateConversation, {
      id: responseId,
      text: fullResponse,
      status: JobInsightStatus.COMPLETED,
    });

    // Deduct credit after successful job creation
    await ctx.runMutation(api.creditManagement.deductCredit, {
      userId: args.userId,
      credit: CREDIT_COST.JOB_CHAT_MESSAGE,
    });
    return;
  },
});

export const getConversationHistory = query({
  args: {
    jobId: v.id("jobs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("jobInsightConversations")
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .order("desc");

    if (args.limit) {
      return await conversations.take(args.limit);
    }

    return conversations.take(5);
  },
});

export const updateConversation = mutation({
  args: {
    id: v.id("jobInsightConversations"),
    text: v.optional(v.string()),
    status: v.union(
      v.literal(JobInsightStatus.PENDING),
      v.literal(JobInsightStatus.COMPLETED),
      v.literal(JobInsightStatus.FAILED)
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    return await ctx.db.patch(id, {
      ...rest,
      updatedAt: Date.now(),
    });
  },
});
