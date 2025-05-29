import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { paymentStatus } from "@/lib/constants";
import { Id } from "./_generated/dataModel";

export const createPayment = mutation({
  args: {
    orderId: v.optional(v.string()), // PayPal order ID
    transactionId: v.optional(v.string()), // PayPal transaction ID
    credits: v.number(),
    userId: v.string(), // User ID
    amount: v.number(), // Amount in USD
    status: v.union(
      v.literal(paymentStatus.PENDING),
      v.literal(paymentStatus.COMPLETED),
      v.literal(paymentStatus.FAILED)
    ),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("payments", {
      paypalOrderId: args.orderId,
      transactionId: args.transactionId,
      userId: args.userId,
      amounts: args.amount,
      credits: args.credits,
      status: args.status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return paymentId;
  },
});

export const updatePayment = mutation({
  args: {
    paymentId: v.string(),
    status: v.union(
      v.literal(paymentStatus.PENDING),
      v.literal(paymentStatus.COMPLETED),
      v.literal(paymentStatus.FAILED)
    ),
    transactionId: v.optional(v.string()),
    paypalOrderId: v.optional(v.string()),
  },
  handler: async (ctx, { paymentId, status, transactionId, paypalOrderId }) => {
    if (!paymentId) {
      throw new ConvexError("Payment Id missing");
    }
    await ctx.db.patch(paymentId as Id<"payments">, {
      status,
      transactionId,
      paypalOrderId,
      updatedAt: Date.now(),
    });
  },
});
