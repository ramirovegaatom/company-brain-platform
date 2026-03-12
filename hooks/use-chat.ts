"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, ChatQueryResponse } from "@/lib/types";
import { postChatQuery } from "@/lib/api";

let messageCounter = 0;

function createId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Derive activeClientId from the last context_card response
  const activeClientId = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (
        msg.role === "assistant" &&
        msg.response?.response_type === "context_card" &&
        msg.response.client?.id
      ) {
        return msg.response.client.id;
      }
    }
    return null;
  })();

  const activeClientName = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (
        msg.role === "assistant" &&
        msg.response?.response_type === "context_card" &&
        msg.response.client?.name
      ) {
        return msg.response.client.name;
      }
    }
    return null;
  })();

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: createId(),
        role: "user",
        content: text.trim(),
      };

      const loadingMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "",
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setIsLoading(true);

      // Build conversation history (last 10 messages, role + content only)
      const history = messages
        .filter((m) => !m.isLoading)
        .slice(-10)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content || m.response?.answer || "",
        }));

      try {
        const response: ChatQueryResponse = await postChatQuery({
          question: text.trim(),
          conversation_history: history,
          client_id: activeClientId,
        });

        const assistantMsg: ChatMessage = {
          id: loadingMsg.id,
          role: "assistant",
          content: response.answer || response.summary || "",
          response,
        };

        setMessages((prev) =>
          prev.map((m) => (m.id === loadingMsg.id ? assistantMsg : m))
        );
      } catch (error) {
        const errorMsg: ChatMessage = {
          id: loadingMsg.id,
          role: "assistant",
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : "Error inesperado. Intentá de nuevo.",
        };

        setMessages((prev) =>
          prev.map((m) => (m.id === loadingMsg.id ? errorMsg : m))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, activeClientId]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading,
    activeClientId,
    activeClientName,
  };
}
