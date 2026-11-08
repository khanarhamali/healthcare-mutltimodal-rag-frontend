import { Thread, SendMessageParams } from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0";

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

export async function sendChatMessage(params: SendMessageParams) {
  const formData = new FormData();
  formData.append("user_id", params.userId);
  if (params.threadId) formData.append("thread_id", params.threadId);
  if (params.userQuery) formData.append("user_query", params.userQuery);
  if (params.imageFile) formData.append("image", params.imageFile);

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Backend agent error.");
  }

  return await res.json();
}

export async function deleteUserThread(userId: string, threadId: string) {
  const res = await fetch(`${API_BASE_URL}/threads/${userId}/${threadId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete thread.");
  return await res.json();
}
