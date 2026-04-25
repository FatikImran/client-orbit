import { CSSProperties } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type MessageListProps = {
  messages: ChatMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {messages.map((msg, idx) => (
        <div
          key={`${msg.role}-${idx}`}
          className={`message-bubble ${msg.role === "user" ? "message-user" : "message-assistant"}`}
          style={{ "--enter-delay": `${Math.min(idx * 40, 380)}ms` } as CSSProperties}
        >
          <strong className="message-role">{msg.role === "user" ? "You" : "Support AI"}</strong>
          <span className="message-content">{msg.content}</span>
        </div>
      ))}
    </div>
  );
}
