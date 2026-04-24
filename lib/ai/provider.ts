import { GoogleGenAI } from "@google/genai";
import { needsEscalation, normalizeLead } from "@/lib/ai/guardrails";
import { BUSINESS_CONTEXT, LEAD_EXTRACTION_PROMPT, SUPPORT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { logWarn } from "@/lib/utils/logger";
import type { ChatResult, LeadCapture } from "@/types/chat";

function heuristicLeadExtraction(message: string): LeadCapture {
  const lead: LeadCapture = {};
  const email = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.[0];
  if (email) {
    lead.email = email.toLowerCase();
  }

  const name = message.match(/my name is\s+([a-zA-Z ]{2,40})/i)?.[1];
  if (name) {
    lead.name = name.trim();
  }

  if (/urgent|asap|today|immediately/i.test(message)) {
    lead.urgency = "high";
  } else if (/soon|this week/i.test(message)) {
    lead.urgency = "medium";
  }

  if (/need|looking for|want/i.test(message)) {
    lead.need = message.slice(0, 220);
  }

  return normalizeLead(lead);
}

function fallbackReply(message: string) {
  const m = message.toLowerCase();

  if (m.includes("shipping")) {
    return "Local shipping takes 3-5 business days and international shipping takes 7-10 business days. If you share your order context, I can help further.";
  }

  if (m.includes("refund")) {
    return "Our demo policy allows refunds within 7 days for damaged or incorrect items. If this is your case, I can escalate to a human support specialist.";
  }

  if (m.includes("price") || m.includes("pricing")) {
    return "I can help with pricing questions. Please share the product or service name so I can provide the correct details.";
  }

  return "I may be missing a policy detail. I can escalate this to a human support specialist.";
}

export async function generateSupportReply(userMessage: string): Promise<ChatResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!apiKey) {
    const lead = heuristicLeadExtraction(userMessage);
    const reply = fallbackReply(userMessage);
    return {
      reply,
      lead,
      escalationNeeded: needsEscalation(reply, userMessage),
      source: "fallback"
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SUPPORT_SYSTEM_PROMPT}\n\n${BUSINESS_CONTEXT}\n\nCustomer message: ${userMessage}`
            }
          ]
        }
      ]
    });

    const reply = response.text?.trim() || "I may be missing a policy detail. I can escalate this to a human support specialist.";

    let lead: LeadCapture = heuristicLeadExtraction(userMessage);
    try {
      const extractionResponse = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [{ text: `${LEAD_EXTRACTION_PROMPT}\n\nMessage: ${userMessage}` }]
          }
        ]
      });

      const extractionText = extractionResponse.text?.trim() || "{}";
      const parsed = JSON.parse(extractionText.replace(/```json|```/g, ""));
      lead = normalizeLead(parsed as LeadCapture);
    } catch (extractionError) {
      logWarn("gemini_lead_extraction_failed", {
        message: extractionError instanceof Error ? extractionError.message : "unknown"
      });
    }

    return {
      reply,
      lead,
      escalationNeeded: needsEscalation(reply, userMessage),
      source: "gemini"
    };
  } catch (error) {
    logWarn("gemini_generation_failed", {
      message: error instanceof Error ? error.message : "unknown"
    });

    const lead = heuristicLeadExtraction(userMessage);
    const reply = fallbackReply(userMessage);
    return {
      reply,
      lead,
      escalationNeeded: needsEscalation(reply, userMessage),
      source: "fallback"
    };
  }
}
