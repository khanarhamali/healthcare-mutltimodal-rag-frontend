import { Thread, SendMessageParams } from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function fetchUserThreads(userId: string): Promise<Thread[]> {
  const res = await fetch(`${API_BASE_URL}/threads/${userId}`);
  if (!res.ok) throw new Error("Failed to load conversation threads.");
  const data = await res.json();
  return data.threads || [];
}

export async function fetchThreadHistory(userId: string, threadId: string) {
  const res = await fetch(`${API_BASE_URL}/history/${userId}/${threadId}`);
  if (!res.ok) throw new Error("Failed to load thread history.");
  return await res.json();
}

export async function streamChatMessage(
  params: SendMessageParams,
  callbacks: {
    onMeta?: (meta: {
      thread_id: string;
      is_new_thread: boolean;
      uploaded_image_url?: string;
    }) => void;
    onCondition?: (condition: string) => void;
    onToken: (token: string) => void;
    onDone?: (info: { message_count: number; max_messages: number }) => void;
  }
) {
  const formData = new FormData();
  formData.append("user_id", params.userId);
  if (params.threadId) formData.append("thread_id", params.threadId);
  if (params.userQuery) formData.append("user_query", params.userQuery);
  if (params.imageFile) formData.append("image", params.imageFile);

  const res = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Backend agent error.");
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  if (!reader) throw new Error("Streaming not supported by browser.");

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      if (part.startsWith("data: ")) {
        const payload = JSON.parse(part.slice(6));
        if (payload.type === "meta" && callbacks.onMeta) {
          callbacks.onMeta(payload);
        } else if (payload.type === "condition" && callbacks.onCondition) {
          callbacks.onCondition(payload.detected_condition);
        } else if (payload.type === "token") {
          callbacks.onToken(payload.content);
        } else if (payload.type === "done" && callbacks.onDone) {
          callbacks.onDone(payload);
        } else if (payload.type === "error") {
          throw new Error(payload.detail);
        }
      }
    }
  }
}

export async function deleteUserThread(userId: string, threadId: string) {
  const res = await fetch(`${API_BASE_URL}/threads/${userId}/${threadId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to permanently delete thread.");
  return await res.json();
}
