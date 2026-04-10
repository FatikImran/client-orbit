export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type MessageListProps = {
  messages: ChatMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div style={{ display: "grid", gap: "0.6rem", maxHeight: 380, overflowY: "auto", paddingRight: "0.25rem" }}>
      {messages.map((msg, idx) => (
        <div
          key={`${msg.role}-${idx}`}
          style={{
            justifySelf: msg.role === "user" ? "end" : "start",
            maxWidth: "85%",
            borderRadius: 14,
            padding: "0.65rem 0.8rem",
            border: "1px solid var(--line)",
            background: msg.role === "user" ? "#eef6f2" : "#ffffff"
          }}
        >
          <strong style={{ fontSize: "0.78rem", opacity: 0.7, display: "block", marginBottom: "0.2rem" }}>
            {msg.role === "user" ? "You" : "Support AI"}
          </strong>
          <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}>{msg.content}</span>
        </div>
      ))}
    </div>
  );
}
