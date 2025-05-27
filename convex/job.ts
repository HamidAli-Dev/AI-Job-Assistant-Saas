import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";

import { jobStatus } from "@/lib/constants";
import { CREDIT_COST, FREE_TIER_CREDITS } from "@/lib/api-limits";

export const createJob = mutation({
  args: {
    userId: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    // First checks if user has API limits record
    let apiLimits = await ctx.db
      .query("apiLimits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    // If no record, initialize with free tier credits
    if (!apiLimits) {
      const newLimitsId = await ctx.db.insert("apiLimits", {
        userId: args.userId,
        credits: FREE_TIER_CREDITS,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      apiLimits = await ctx.db.get(newLimitsId);
    }

    if (!apiLimits) {
      throw new ConvexError("Failed to initialize your account");
    }

    // Check if user has enough credits to create a job (need 2 credits for job creation)
    if (apiLimits.credits < CREDIT_COST.JOB_CREATION) {
      return {
        data: null,
        message: "You have run out of credits. Buy more to continue.",
        requiresUpgrade: true,
      };
    }

    const jobId = await ctx.db.insert("jobs", {
      userId: args.userId,
      jobTitle: "Untitled",
      originalDescription: args.jobDescription,
      processedDescription: "",
      htmlFormatDescription: "",
      status: jobStatus.PROCESSING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    //  Deduct credit after successful job creation
    await ctx.runMutation(api.creditManagement.deductCredit, {
      userId: args.userId,
      credit: CREDIT_COST.JOB_CREATION,
    });

    // TODO: AI processing

    return { data: jobId, success: true };
  },
});
