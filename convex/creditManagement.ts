import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const deductCredit = mutation({
  args: { userId: v.string(), credit: v.number() },
  handler: async (ctx, args) => {
    const apiLimits = await ctx.db
      .query("apiLimits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!apiLimits || apiLimits?.credits < args.credit) {
      throw new ConvexError({
        type: "INSUFFICIENT_CREDITS",
        message: "You have run out of credits",
        required: args.credit,
        available: apiLimits?.credits ?? 0,
      });
    }

    const newCredits = parseFloat((apiLimits.credits - args.credit).toFixed(2));
    await ctx.db.patch(apiLimits._id, {
      credits: newCredits,
      updatedAt: Date.now(),
    });
  },
});
