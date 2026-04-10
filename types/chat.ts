export type Role = "system" | "user" | "assistant";

export type Message = {
  role: Role;
  content: string;
};

export type LeadCapture = {
  name?: string;
  email?: string;
  need?: string;
  urgency?: "low" | "medium" | "high";
};

export type ChatRequestBody = {
  sessionId: string;
  message: string;
};

export type ChatResult = {
  reply: string;
  lead: LeadCapture;
  escalationNeeded: boolean;
  source: "gemini" | "fallback";
};
