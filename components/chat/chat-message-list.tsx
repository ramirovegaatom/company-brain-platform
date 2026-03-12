"use client";

import { useRef, useEffect } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./chat-message";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  onClientClick: (name: string) => void;
}

export function ChatMessageList({ messages, onClientClick }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-lg font-medium">Company Brain Chat</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Preguntá sobre cualquier cuenta en lenguaje natural.
          </p>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
          <p>&quot;Cómo está Sonria?&quot;</p>
          <p>&quot;Cuentas en riesgo&quot;</p>
          <p>&quot;Qué playbook le aplica?&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onClientClick={onClientClick} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
