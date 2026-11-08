import React from "react";
import { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-teal-600 text-white"
            : "bg-white border border-slate-200 text-slate-800"
        }`}
      >
        {message.image_url && (
          <img
            src={message.image_url}
            alt="Skin condition"
            className="w-48 h-48 object-cover rounded-lg mb-2 border border-white/20"
          />
        )}

        {message.detected_condition && message.detected_condition !== "None" && (
          <div className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
            Detected Condition: {message.detected_condition}
          </div>
        )}

        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
