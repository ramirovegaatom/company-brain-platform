"use client";

import { useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      {messages.length > 0 && (
        <div className="flex items-center justify-end border-b border-border px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="size-3.5" />
            Limpiar chat
          </Button>
        </div>
      )}
      <ChatMessageList messages={messages} onClientClick={handleClientClick} />
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        activeClientName={activeClientName}
      />
    </div>
  );
}
