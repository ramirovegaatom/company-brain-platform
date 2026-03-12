"use client";

import ReactMarkdown from "react-markdown";

interface TextMessageProps {
  content: string;
  sources?: string[];
}

export function TextMessage({ content, sources }: TextMessageProps) {
  return (
    <div className="rounded-2xl rounded-bl-md bg-muted/50 px-4 py-3">
      <div className="prose prose-sm prose-invert max-w-none text-sm">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {sources && sources.length > 0 && (
        <div className="mt-2 border-t border-border/50 pt-2">
          <p className="text-xs text-muted-foreground">
            Fuentes: {sources.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
