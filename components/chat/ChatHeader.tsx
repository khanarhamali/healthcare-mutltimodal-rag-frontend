import React from "react";

interface ChatHeaderProps {
  activeThreadId: string | null;
}

export function ChatHeader({ activeThreadId }: ChatHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <span className="text-sm font-medium text-slate-600">
        {activeThreadId ? `Thread: ${activeThreadId.slice(0, 8)}...` : "New Consultation"}
      </span>
      <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
        Multimodal Skin RAG
      </span>
    </header>
  );
}
