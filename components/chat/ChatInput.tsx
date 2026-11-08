"use client";

import React, { useState, useRef } from "react";
import { ImagePlus, Send, X, AlertTriangle, Plus } from "lucide-react";

interface ChatInputProps {
  isSending: boolean;
  isLimitReached: boolean;
  onNewChat: () => void;
  onSendMessage: (
    query: string,
    imageFile: File | null,
    imagePreview: string | null
  ) => Promise<void>;
}

export function ChatInput({
  isSending,
  isLimitReached,
  onNewChat,
  onSendMessage,
}: ChatInputProps) {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function clearImage() {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isSending || isLimitReached) return;

    const queryToSend = inputText;
    const fileToSend = selectedImage;
    const previewToSend = imagePreview;

    setInputText("");
    clearImage();

    await onSendMessage(queryToSend, fileToSend, previewToSend);
  }

  if (isLimitReached) {
    return (
      <div className="p-4 bg-amber-50 border-t border-amber-200">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-amber-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              This consultation has reached its 20-message limit to ensure clinical accuracy. Start a new consultation to continue.
            </span>
          </div>
          <button
            onClick={onNewChat}
            className="shrink-0 flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            New Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {imagePreview && (
          <div className="relative inline-block mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-300"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-teal-500">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-teal-600 rounded-lg transition"
            title="Upload Skin Image"
          >
            <ImagePlus className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your symptoms or ask a follow-up..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-slate-800"
          />

          <button
            type="submit"
            disabled={isSending || (!inputText.trim() && !selectedImage)}
            className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white p-2 rounded-lg transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
