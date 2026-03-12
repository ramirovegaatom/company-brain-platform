"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatMessage, ChatQueryResponse } from "@/lib/types";
import { postChatQuery } from "@/lib/api";

const STORAGE_KEY = "company-brain-chat";

let messageCounter = 0;

function createId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    // Filter out any loading messages that were persisted mid-flight
    return parsed.filter((m) => !m.isLoading);
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    // Only persist completed messages (no loading placeholders)
    const toSave = messages.filter((m) => !m.isLoading);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMessages(loadMessages());
    setInitialized(true);
  }, []);

  // Persist to localStorage on change (skip initial empty render)
  useEffect(() => {
    if (initialized) {
      saveMessages(messages);
    }
  }, [messages, initialized]);

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
    localStorage.removeItem(STORAGE_KEY);
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
