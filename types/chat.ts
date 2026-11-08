export interface Thread {
  thread_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image_url?: string;
  detected_condition?: string;
}

export interface SendMessageParams {
  userId: string;
  threadId?: string | null;
  userQuery?: string;
  imageFile?: File | null;
}
