"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { AuthForm } from "@/components/auth/AuthForm";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";

export default function HomePage() {
  const { user, loading, signOut } = useAuth();
  const {
    threads,
    activeThreadId,
    messages,
    isSending,
    isThreadLimitReached,
    maxMessages,
    startNewChat,
    selectThread,
    removeThread,
    sendMessage,
  } = useChat(user?.id);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar
        userEmail={user.email || "Patient"}
        threads={threads}
        activeThreadId={activeThreadId}
        onNewChat={startNewChat}
        onSelectThread={selectThread}
        onDeleteThread={removeThread}
        onLogout={signOut}
      />

      <main className="flex-1 flex flex-col">
        <ChatHeader
          activeThreadId={activeThreadId}
          messageCount={messages.length}
          maxMessages={maxMessages}
          onDeleteActiveThread={() => activeThreadId && removeThread(activeThreadId)}
          onLogout={signOut}
        />
        <MessageList
          messages={messages}
          isSending={isSending}
          userEmail={user.email || "Patient"}
          onQuickPrompt={(prompt) => sendMessage(prompt, null, null)}
        />
        <ChatInput
          isSending={isSending}
          isLimitReached={isThreadLimitReached}
          onNewChat={startNewChat}
          onSendMessage={sendMessage}
        />
      </main>
    </div>
  );
}
