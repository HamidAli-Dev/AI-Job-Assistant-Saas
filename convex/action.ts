"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

import { processAndCleanJobDescription } from "@/lib/job-process";
import { GEMINI_AI } from "@/lib/gemini-ai";
import { api } from "./_generated/api";
import { jobStatus } from "@/lib/constants";
import { getJobTitleDescPrompt } from "@/lib/prompt";

export const processJobWithAI = internalAction({
  args: {
    jobId: v.id("jobs"),
    userId: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const processedDesc = await processAndCleanJobDescription(
      args.jobDescription
    );

    let title = "Untitled";
    let htmlDecription = "";

    try {
      const prompt = getJobTitleDescPrompt(processedDesc);
      const response = await GEMINI_AI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          maxOutputTokens: 2000,
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsedResponse = JSON.parse(response.text);
        title = parsedResponse.title;
        htmlDecription = parsedResponse.htmlDescription;
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }

    await ctx.runMutation(api.job.updateJob, {
      jobId: args.jobId,
      jobTitle: title,
      processedDescription: processedDesc,
      htmlFormatDescription: htmlDecription,
      status: jobStatus.READY,
    });

    // TODO: Send Welcome message
  },
});
