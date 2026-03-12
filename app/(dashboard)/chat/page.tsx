"use client";

import { useCallback } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage() {
  const {
    messages,
    sendMessage,
    clearChat,
    isLoading,
    activeClientId,
    activeClientName,
  } = useChat();

  const handleClientClick = useCallback(
    (name: string) => {
      sendMessage(`cómo está ${name}?`);
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-1 flex-col">
      <ChatMessageList messages={messages} onClientClick={handleClientClick} />
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        activeClientName={activeClientName}
      />
    </div>
  );
}
