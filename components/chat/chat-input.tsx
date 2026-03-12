"use client";

import { useState, useRef, useCallback } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  activeClientName: string | null;
  onClearContext?: () => void;
}

export function ChatInput({
  onSend,
  isLoading,
  activeClientName,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      {activeClientName && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            Contexto: {activeClientName}
          </span>
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Preguntá sobre cualquier cuenta..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="shrink-0"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
