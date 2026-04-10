export type LeadRecord = {
  id: string;
  sessionId: string;
  name?: string;
  email?: string;
  need?: string;
  urgency?: string;
  createdAt: string;
};

export type ConversationRecord = {
  id: string;
  sessionId: string;
  userMessage: string;
  assistantReply: string;
  escalationNeeded: boolean;
  source: "gemini" | "fallback";
  createdAt: string;
};
