import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  fetchUserThreads,
  fetchThreadHistory,
  streamChatMessage,
  deleteUserThread,
} from "@/lib/api";
import { Thread, ChatMessage } from "@/types/chat";

export const MAX_THREAD_MESSAGES = 20;

export function useChat(userId?: string) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const isThreadLimitReached = messages.length >= MAX_THREAD_MESSAGES;

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
    } catch (error: any) {
      toast.error(error.message || "Could not resume consultation.");
    } finally {
      setIsSending(false);
    }
  }

  async function removeThread(threadId: string) {
    if (!userId) return;
    try {
      await deleteUserThread(userId, threadId);
      if (activeThreadId === threadId) {
        startNewChat();
      }
      await loadThreads();
      toast.success("Permanent Erasure Complete: Consultation & images deleted.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete consultation.");
    }
  }

  async function sendMessage(query: string, imageFile: File | null, imagePreview: string | null) {
    if (!userId || (!query.trim() && !imageFile) || isSending) return;

    if (isThreadLimitReached) {
      toast.warning("Thread limit reached (20 messages). Start a new consultation.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: query.trim() || "Uploaded a skin image for analysis",
        image_url: imagePreview || undefined,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);
    setIsSending(true);

    try {
      await streamChatMessage(
        {
          userId,
          threadId: activeThreadId,
          userQuery: query.trim(),
          imageFile,
        },
        {
          onMeta: async (meta) => {
            if (meta.is_new_thread || !activeThreadId) {
              setActiveThreadId(meta.thread_id);
              await loadThreads();
            }
          },
          onCondition: (condition) => {
            setMessages((prev) => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              updated[lastIdx] = { ...updated[lastIdx], detected_condition: condition };
              return updated;
            });
          },
          onToken: (token) => {
            setMessages((prev) => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              updated[lastIdx] = {
                ...updated[lastIdx],
                content: updated[lastIdx].content + token,
              };
              return updated;
            });
          },
          onDone: async (info) => {
            await loadThreads();
            if (info.message_count >= info.max_messages) {
              toast.info("This consultation has reached its 20-message limit.");
            }
          },
        }
      );
    } catch (error: any) {
      toast.error(error.message || "Connection error");
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          role: "assistant",
          content: `Error: ${error.message || "Failed to connect to backend server."}`,
        };
        return updated;
      });
    } finally {
      setIsSending(false);
    }
  }

  return {
    threads,
    activeThreadId,
    messages,
    isSending,
    isThreadLimitReached,
    maxMessages: MAX_THREAD_MESSAGES,
    startNewChat,
    selectThread,
    removeThread,
    sendMessage,
  };
}
