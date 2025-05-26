export const jobStatus = {
  PROCESSING: "PROCESSING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type jobStatusType = keyof typeof jobStatus;

export const Role = {
  USER: "USER",
  AI: "AI",
} as const;

export type RoleType = keyof typeof Role;

export const JobInsightStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type JobInsightStatusType = keyof typeof JobInsightStatus;

export const paymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type PaymentStatusType = keyof typeof paymentStatus;
