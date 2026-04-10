"use client";

import { FormEvent, useMemo, useState } from "react";
import LeadBadge from "@/components/LeadBadge";
import MessageList, { ChatMessage } from "@/components/MessageList";

type ApiLead = {
  name?: string;
  email?: string;
  need?: string;
  urgency?: string;
};

type ChatResponse = {
  reply: string;
  lead: ApiLead;
  escalationNeeded: boolean;
  requestId: string;
  source: "gemini" | "fallback";
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Welcome to Client Orbit support. Ask me about pricing, shipping, refunds, or service details."
  }
];

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState<ApiLead>({});
  const [meta, setMeta] = useState<{ escalationNeeded?: boolean; source?: string; requestId?: string }>({});

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") {
      return "server-session";
    }
    const key = "client_orbit_session_id";
    const existing = window.localStorage.getItem(key);
    if (existing) {
      return existing;
    }
    const generated = `sess-${crypto.randomUUID()}`;
    window.localStorage.setItem(key, generated);
    return generated;
  }, []);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) {
      return;
    }

    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text, sessionId })
      });

      const data = (await response.json()) as ChatResponse | { error: string; requestId?: string };

      if (!response.ok || !("reply" in data)) {
        const errorText = "error" in data ? data.error : "Unexpected API error.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I could not process that right now. ${errorText}`
          }
        ]);
        setMeta((prev) => ({ ...prev, requestId: "requestId" in data ? data.requestId : prev.requestId }));
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setLead(data.lead);
      setMeta({
        escalationNeeded: data.escalationNeeded,
        source: data.source,
        requestId: data.requestId
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network issue occurred. Please try again in a moment."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ display: "grid", gap: "0.9rem" }}>
      <h3 style={{ margin: 0 }}>Live Demo Chat</h3>
      <MessageList messages={messages} />
      <form onSubmit={handleSend} style={{ display: "grid", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a support question..."
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid var(--line)",
            padding: "0.7rem 0.8rem",
            background: "#fff"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            borderRadius: 12,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 700,
            padding: "0.7rem 0.9rem",
            cursor: loading ? "wait" : "pointer"
          }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      <div style={{ display: "grid", gap: "0.45rem" }}>
        <strong style={{ fontSize: "0.85rem" }}>Lead Capture Snapshot</strong>
        <div className="badges">
          <LeadBadge label="Name" value={lead.name} />
          <LeadBadge label="Email" value={lead.email} />
          <LeadBadge label="Need" value={lead.need} />
          <LeadBadge label="Urgency" value={lead.urgency} />
        </div>
      </div>

      <small style={{ color: "var(--muted)" }}>
        Source: {meta.source ?? "n/a"} | Escalation: {meta.escalationNeeded ? "yes" : "no"} | Request ID: {meta.requestId ?? "n/a"}
      </small>
    </div>
  );
}
