"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ContextCardMessage } from "./context-card-message";
import { ClientListMessage } from "./client-list-message";
import { TextMessage } from "./text-message";
import { HelpMessage } from "./help-message";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  onClientClick: (name: string) => void;
}

export function ChatMessage({ message, onClientClick }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant message
  if (message.isLoading) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] space-y-3 rounded-2xl rounded-bl-md bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="size-4 animate-pulse" />
            <span className="text-sm">Pensando...</span>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    );
  }

  const response = message.response;

  if (!response) {
    // Plain text fallback (error messages, etc.)
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%]">
          <TextMessage content={message.content} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] w-full">
        {response.response_type === "context_card" && response.context_card && (
          <ContextCardMessage
            contextCard={response.context_card}
            client={response.client}
          />
        )}
        {response.response_type === "client_list" && response.clients && (
          <ClientListMessage
            clients={response.clients}
            summary={response.summary}
            onClientClick={onClientClick}
          />
        )}
        {response.response_type === "text" && (
          <TextMessage content={response.answer || ""} sources={response.sources} />
        )}
        {response.response_type === "help" && (
          <HelpMessage content={response.answer || ""} />
        )}
      </div>
    </div>
  );
}
