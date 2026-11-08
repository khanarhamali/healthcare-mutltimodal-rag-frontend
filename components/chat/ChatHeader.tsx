import React from "react";
import { LogOut, ShieldCheck, Trash2 } from "lucide-react";

interface ChatHeaderProps {
  activeThreadId: string | null;
  messageCount: number;
  maxMessages: number;
  onDeleteActiveThread: () => void;
  onLogout: () => void;
}

export function ChatHeader({
  activeThreadId,
  messageCount,
  maxMessages,
  onDeleteActiveThread,
  onLogout,
}: ChatHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-800">Patient Portal</span>
        <span className="text-slate-300">|</span>
        <span className="text-xs font-medium text-slate-500">
          {activeThreadId ? `Session: ${activeThreadId.slice(0, 8)}...` : "New Session"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            messageCount >= maxMessages
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-600"
          }`}
          title="Thread capacity limit to prevent AI context drift"
        >
          {messageCount}/{maxMessages} msgs
        </span>

        <span className="hidden sm:flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Aligned Architecture
        </span>

        {activeThreadId && (
          <button
            onClick={onDeleteActiveThread}
            className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg font-medium transition"
            title="Permanently delete this chat & images"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Delete Chat</span>
          </button>
        )}

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
