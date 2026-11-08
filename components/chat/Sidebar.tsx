"use client";

import React from "react";
import { Plus, MessageSquare, Trash2, Stethoscope, LogOut } from "lucide-react";
import { Thread } from "@/types/chat";

interface SidebarProps {
  userEmail: string;
  threads: Thread[];
  activeThreadId: string | null;
  onNewChat: () => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onLogout: () => void;
}

export function Sidebar({
  userEmail,
  threads,
  activeThreadId,
  onNewChat,
  onSelectThread,
  onDeleteThread,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-6 h-6 text-teal-400" />
          <h1 className="font-semibold text-lg tracking-tight">DermaAI RAG</h1>
        </div>
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white py-2.5 px-4 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase px-2 mb-2">
          Your Consultations
        </p>
        {threads.length === 0 ? (
          <p className="text-sm text-slate-500 px-2">No previous threads yet.</p>
        ) : (
          threads.map((thread) => (
            <div
              key={thread.thread_id}
              onClick={() => onSelectThread(thread.thread_id)}
              className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-sm transition ${
                activeThreadId === thread.thread_id
                  ? "bg-slate-800 text-teal-300"
                  : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MessageSquare className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="truncate">{thread.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteThread(thread.thread_id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 transition"
                title="Delete thread"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
        <div className="truncate pr-2">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-xs font-medium text-slate-200 truncate">{userEmail}</p>
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-400 rounded-lg transition"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
