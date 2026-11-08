import { useState, useEffect, useCallback } from "react";
import {
  fetchUserThreads,
  fetchThreadHistory,
  sendChatMessage,
  deleteUserThread,
} from "@/lib/api";
import { Thread, ChatMessage } from "@/types/chat";

export function useChat(userId?: string) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const loadThreads = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await fetchUserThreads(userId);
      setThreads(data);
    } catch (error) {
      console.error("Error loading threads:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadThreads();
    } else {
      setThreads([]);
      setMessages([]);
      setActiveThreadId(null);
    }
  }, [userId, loadThreads]);

  function startNewChat() {
    setActiveThreadId(null);
    setMessages([]);
  }

  async function selectThread(threadId: string) {
    if (!userId) return;
    setActiveThreadId(threadId);
    setIsSending(true);
    try {
      const data = await fetchThreadHistory(userId, threadId);
      const parsed: ChatMessage[] = (data.messages || []).map((m: any) => {
        const imgMatch = m.content.match(/\[Image:\s*(https?:\/\/[^\]]+)\]/);
        const cleanText = m.content.replace(/\n?\[Image:\s*https?:\/\/[^\]]+\]/, "").trim();
        return {
          role: m.role,
          content: cleanText || (imgMatch ? "Uploaded skin image" : m.content),
          image_url: imgMatch ? imgMatch[1] : undefined,
        };
      });
      setMessages(parsed);
    } catch (error) {
      console.error("Error resuming thread:", error);
    } finally {
      setIsSending(false);
    }
  }

  async function removeThread(threadId: string) {
    if (!userId) return;
    await deleteUserThread(userId, threadId);
    if (activeThreadId === threadId) {
      startNewChat();
    }
    await loadThreads();
  }

  async function sendMessage(query: string, imageFile: File | null, imagePreview: string | null) {
    if (!userId || (!query.trim() && !imageFile) || isSending) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: query.trim() || "Uploaded a skin image for analysis",
        image_url: imagePreview || undefined,
      },
    ]);
    setIsSending(true);

    try {
      const res = await sendChatMessage({
        userId,
        threadId: activeThreadId,
        userQuery: query.trim(),
        imageFile,
      });

      if (res.is_new_thread || !activeThreadId) {
        setActiveThreadId(res.thread_id);
        await loadThreads();
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.response,
          detected_condition: res.detected_condition,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message || "Failed to connect to backend server."}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return {
    threads,
    activeThreadId,
    messages,
    isSending,
    startNewChat,
    selectThread,
    removeThread,
    sendMessage,
  };
}
