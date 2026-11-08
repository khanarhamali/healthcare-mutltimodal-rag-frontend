"use client";

import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Stethoscope,
  LogOut,
  Shield,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Thread } from "@/types/chat";

interface SidebarProps {
  userEmail: string;
  threads: Thread[];
  activeThreadId: string | null;
  onNewChat: () => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => Promise<void>;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function confirmHipaaDelete() {
    if (!threadToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteThread(threadToDelete.thread_id);
    } finally {
      setIsDeleting(false);
      setThreadToDelete(null);
    }
  }

  return (
    <>
      <aside className="w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-teal-400" />
            <div>
              <h1 className="font-bold text-base tracking-tight leading-none">Patient Portal</h1>
              <span className="text-[11px] text-teal-400 font-medium">DermaAI Clinical Assistant</span>
            </div>
          </div>

          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Consultation
          </button>

          {/* Search Consultations Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search consultations..."
              className="w-full bg-slate-800/80 text-xs text-slate-200 placeholder-slate-400 pl-8 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase">
              History ({filteredThreads.length})
            </p>
            <span
              className="text-[10px] text-slate-400 flex items-center gap-1"
              title="HIPAA-Ready Right to Erasure Enabled"
            >
              <Shield className="w-3 h-3 text-teal-500" /> Privacy
            </span>
          </div>

          {filteredThreads.length === 0 ? (
            <p className="text-xs text-slate-500 px-2 py-4 text-center">
              {searchQuery ? "No matching consultations." : "No saved consultations yet."}
            </p>
          ) : (
            filteredThreads.map((thread) => (
              <div
                key={thread.thread_id}
                onClick={() => onSelectThread(thread.thread_id)}
                className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-sm transition ${
                  activeThreadId === thread.thread_id
                    ? "bg-slate-800 text-teal-300 font-medium"
                    : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate text-xs">{thread.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setThreadToDelete(thread);
                  }}
                  className="opacity-70 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 transition"
                  title="Permanently Delete Consultation (HIPAA Erasure)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Patient Profile & Sign Out Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
          <div className="truncate">
            <p className="text-[11px] text-slate-400">Logged in Patient</p>
            <p className="text-xs font-medium text-slate-200 truncate">{userEmail}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/90 text-slate-200 hover:text-white py-2 px-3 rounded-lg text-xs font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Custom HIPAA Permanent Deletion Modal */}
      {threadToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Permanent Data Erasure</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              You are about to permanently delete{" "}
              <span className="font-semibold text-slate-900">"{threadToDelete.title}"</span>.
              This will immediately wipe all messages, AI memory checkpoints, and uploaded skin images from our servers. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setThreadToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmHipaaDelete}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                {isDeleting ? "Erasing Data..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
