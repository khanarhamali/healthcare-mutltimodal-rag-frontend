"use client";

import React, { useEffect, useRef } from "react";
import { Loader2, Stethoscope } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
  userEmail: string;
}

export function MessageList({ messages, isSending, userEmail }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 && !isSending ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Welcome back, {userEmail.split("@")[0]}
          </h2>
          <p className="text-sm text-slate-500">
            Upload a skin image, ask a question, or select a past thread from the sidebar to resume your consultation.
          </p>
        </div>
      ) : (
        messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
      )}

      {isSending && (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
          Processing request...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
