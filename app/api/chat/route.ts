import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { generateSupportReply } from "@/lib/ai/provider";
import { saveConversation, saveLead } from "@/lib/db/queries";
import { enforceRateLimit } from "@/lib/rateLimit/upstash";
import { logError, logInfo } from "@/lib/utils/logger";
import { chatRequestSchema } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  const requestId = randomUUID();

  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", requestId },
        {
          status: 400
        }
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rate = await enforceRateLimit(`${ip}:${parsed.data.sessionId}`);

    if (!rate.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please retry in a few minutes.",
          requestId,
          retryAfterMs: rate.resetMs - Date.now()
        },
        { status: 429 }
      );
    }

    const result = await generateSupportReply(parsed.data.message);

    try {
      await saveConversation({
        sessionId: parsed.data.sessionId,
        userMessage: parsed.data.message,
        assistantReply: result.reply,
        escalationNeeded: result.escalationNeeded,
        source: result.source
      });

      if (result.lead.email || result.lead.name || result.lead.need || result.lead.urgency) {
        await saveLead({
          sessionId: parsed.data.sessionId,
          name: result.lead.name,
          email: result.lead.email,
          need: result.lead.need,
          urgency: result.lead.urgency
        });
      }
    } catch (storageError) {
      logError("chat_storage_failed", {
        requestId,
        message: storageError instanceof Error ? storageError.message : "unknown"
      });
    }

    logInfo("chat_request_success", {
      requestId,
      source: result.source,
      escalationNeeded: result.escalationNeeded
    });

    return NextResponse.json(
      {
        ...result,
        requestId
      },
      { status: 200 }
    );
  } catch (error) {
    logError("chat_request_failed", {
      requestId,
      message: error instanceof Error ? error.message : "unknown"
    });

    return NextResponse.json(
      {
        error: "Support assistant is temporarily unavailable. Please try again shortly.",
        requestId
      },
      { status: 500 }
    );
  }
}
