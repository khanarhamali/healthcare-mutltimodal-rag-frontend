"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, ZoomIn, X, Stethoscope, User } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Clinical advice copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
            <Stethoscope className="w-4 h-4" />
          </div>
        )}

        <div
          className={`max-w-2xl rounded-2xl px-4 py-3.5 shadow-sm relative group ${
            isUser
              ? "bg-teal-600 text-white"
              : "bg-white border border-slate-200 text-slate-800"
          }`}
        >
          {/* Uploaded Skin Image with Zoom Trigger */}
          {message.image_url && (
            <div className="relative inline-block mb-2.5 group/img">
              <img
                src={message.image_url}
                alt="Patient skin upload"
                onClick={() => setZoomed(true)}
                className="w-52 h-52 object-cover rounded-xl border border-white/20 cursor-zoom-in transition hover:opacity-95"
              />
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-lg opacity-0 group-hover/img:opacity-100 transition"
                title="Enlarge Image"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Detected Skin Condition Badge */}
          {message.detected_condition && message.detected_condition !== "None" && (
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                Visual Analysis: {message.detected_condition}
              </span>
            </div>
          )}

          {/* Formatted Markdown Content */}
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none leading-relaxed prose-headings:text-slate-900 prose-headings:font-semibold prose-strong:text-slate-900 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
              {message.content ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <span className="inline-block w-2 h-4 bg-teal-500 animate-pulse rounded-sm" />
              )}
            </div>
          )}

          {/* Copy Button for Assistant Responses */}
          {!isUser && message.content && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Educational guidance only — consult a dermatologist</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-500 hover:text-teal-600 font-medium transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {zoomed && message.image_url && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={message.image_url}
              alt="Enlarged skin view"
              className="max-h-[85vh] rounded-xl shadow-2xl object-contain"
            />
            <button
              onClick={() => setZoomed(false)}
              className="absolute -top-3 -right-3 bg-white text-slate-900 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
