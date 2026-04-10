import type { LeadCapture } from "@/types/chat";

export function needsEscalation(reply: string, userMessage: string) {
  const text = `${reply} ${userMessage}`.toLowerCase();
  return ["angry", "complaint", "lawyer", "legal", "refund not received", "human", "escalate"].some((term) =>
    text.includes(term)
  );
}

export function redactUnsafe(input: string) {
  return input.replace(/(api[_-]?key|password|secret)\s*[:=]\s*\S+/gi, "$1:[redacted]");
}

export function normalizeLead(lead: LeadCapture): LeadCapture {
  const cleaned: LeadCapture = {};
  if (lead.name) {
    cleaned.name = lead.name.trim().slice(0, 100);
  }
  if (lead.email) {
    cleaned.email = lead.email.trim().toLowerCase();
  }
  if (lead.need) {
    cleaned.need = lead.need.trim().slice(0, 280);
  }
  if (lead.urgency && ["low", "medium", "high"].includes(lead.urgency)) {
    cleaned.urgency = lead.urgency;
  }
  return cleaned;
}
