"use client";

import React, { useEffect, useRef } from "react";
import { Loader2, Stethoscope, Sparkles } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
  userEmail: string;
  onQuickPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  "What is a gentle daily skincare routine for acne-prone skin?",
  "How should I care for dry, irritated, or flaky patches?",
  "What ingredients help fade post-acne dark spots safely?",
  "How do I choose a non-comedogenic broad-spectrum sunscreen?",
];

export function MessageList({
  messages,
  isSending,
  userEmail,
  onQuickPrompt,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 && !isSending ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto">
          <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Welcome back, {userEmail.split("@")}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Upload a clear photo of your skin concern, ask a clinical skincare question, or pick a quick topic below to start.
          </p>

          {/* 1-Click Starter Prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickPrompt(prompt)}
                className="p-3.5 bg-white hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-xs font-medium text-slate-700 transition flex items-start gap-2.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
      )}

      {isSending && messages[messages.length - 1]?.content === "" && (
        <div className="flex items-center gap-2 text-slate-500 text-xs pl-11">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
          Analyzing clinical context & medical guidelines...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
