import { z } from "zod";

export const chatRequestSchema = z.object({
  sessionId: z.string().min(6).max(120),
  message: z.string().min(1).max(1200)
});

export const leadCaptureSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  need: z.string().min(2).max(280).optional(),
  urgency: z.enum(["low", "medium", "high"]).optional()
});
