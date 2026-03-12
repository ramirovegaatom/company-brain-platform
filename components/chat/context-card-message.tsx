"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HealthBadge } from "@/components/accounts/health-badge";
import type { ContextCard, ChatClientSummary } from "@/lib/types";
import { formatMRR } from "@/lib/health-utils";
import ReactMarkdown from "react-markdown";

interface ContextCardMessageProps {
  contextCard: ContextCard;
  client: ChatClientSummary | null;
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "improving") return <TrendingUp className="size-3.5 text-emerald-400" />;
  if (trend === "declining") return <TrendingDown className="size-3.5 text-red-400" />;
  return <Minus className="size-3.5 text-muted-foreground" />;
}

export function ContextCardMessage({ contextCard, client }: ContextCardMessageProps) {
  const { health_score, health_trend, justification, signals, recommended_action } =
    contextCard;

  const riskSignals = signals.filter((s) => s.type === "RIESGO");
  const positiveSignals = signals.filter((s) => s.type === "POSITIVO");

  return (
    <Card className="border-border/50">
      <CardContent className="space-y-3 pt-4">
        {/* Header: name + health */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{contextCard.client_name}</h3>
            {client?.mrr != null && (
              <span className="text-xs text-muted-foreground">
                {formatMRR(client.mrr)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <TrendIcon trend={health_trend} />
            <HealthBadge score={health_score} size="sm" />
          </div>
        </div>

        {/* Justification */}
        <div className="prose prose-sm prose-invert max-w-none text-sm text-muted-foreground leading-relaxed">
          <ReactMarkdown>{justification}</ReactMarkdown>
        </div>

        {/* Signals */}
        {(riskSignals.length > 0 || positiveSignals.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {riskSignals.slice(0, 3).map((s, i) => (
              <span
                key={`r-${i}`}
                className="inline-flex items-center rounded-full bg-red-400/10 px-2 py-0.5 text-xs text-red-400"
              >
                {s.description.length > 50
                  ? s.description.slice(0, 50) + "..."
                  : s.description}
              </span>
            ))}
            {positiveSignals.slice(0, 2).map((s, i) => (
              <span
                key={`p-${i}`}
                className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-400"
              >
                {s.description.length > 50
                  ? s.description.slice(0, 50) + "..."
                  : s.description}
              </span>
            ))}
          </div>
        )}

        {/* Recommended action */}
        {recommended_action && (
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Acción recomendada
            </p>
            <p className="text-sm">{recommended_action.action}</p>
            {recommended_action.playbook && (
              <p className="mt-1 text-xs text-muted-foreground">
                Playbook: {recommended_action.playbook}
              </p>
            )}
          </div>
        )}

        {/* Link to detail */}
        {client && (
          <Link
            href={`/accounts/${client.id}`}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Ver detalle <ArrowRight className="size-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
