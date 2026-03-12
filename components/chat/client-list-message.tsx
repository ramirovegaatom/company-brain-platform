"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HealthBadge } from "@/components/accounts/health-badge";
import type { ChatClientSummary } from "@/lib/types";
import { formatMRR } from "@/lib/health-utils";
import ReactMarkdown from "react-markdown";

interface ClientListMessageProps {
  clients: ChatClientSummary[];
  summary: string | null;
  onClientClick: (name: string) => void;
}

export function ClientListMessage({
  clients,
  summary,
  onClientClick,
}: ClientListMessageProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="space-y-3 pt-4">
        {summary && (
          <div className="prose prose-sm prose-invert max-w-none text-sm text-muted-foreground">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}

        <div className="divide-y divide-border/50">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => onClientClick(client.name)}
              className="flex w-full items-center justify-between gap-3 px-1 py-2 text-left hover:bg-muted/50 rounded transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{client.name}</p>
                {client.industry && (
                  <p className="text-xs text-muted-foreground truncate">
                    {client.industry}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {client.mrr != null && (
                  <span className="text-xs text-muted-foreground">
                    {formatMRR(client.mrr)}
                  </span>
                )}
                <HealthBadge score={client.health_score} size="sm" />
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
