"use client";

import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface HelpMessageProps {
  content: string;
}

export function HelpMessage({ content }: HelpMessageProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-2">
          <HelpCircle className="size-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="prose prose-sm prose-invert max-w-none text-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
