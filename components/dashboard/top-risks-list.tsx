"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthBadge } from "@/components/accounts/health-badge";
import { formatMRR } from "@/lib/health-utils";
import type { TopRiskClient } from "@/lib/types";

interface TopRisksListProps {
  data: TopRiskClient[];
}

export function TopRisksList({ data }: TopRisksListProps) {
  if (!data.length) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Top 10 At-Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-400">No at-risk clients. Portfolio is healthy.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Top 10 At-Risk</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((client) => (
          <div key={client.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
            <HealthBadge score={client.health_score} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/accounts/${client.id}`}
                  className="text-sm font-medium text-foreground hover:text-blue-400 transition-colors truncate"
                >
                  {client.name}
                </Link>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatMRR(client.mrr)}
                </span>
              </div>
              {client.patterns.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {client.patterns.map((p) => (
                    <Badge
                      key={p}
                      variant="outline"
                      className="text-[10px] bg-red-400/10 text-red-400 border-red-400/20"
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              )}
              {client.top_signals.length > 0 && (
                <div className="space-y-0.5">
                  {client.top_signals.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground truncate">
                      <span className="text-red-400 font-medium">{s.score}</span>{" "}
                      {s.subtype.replace(/_/g, " ")}
                      {s.description && ` — ${s.description}`}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
