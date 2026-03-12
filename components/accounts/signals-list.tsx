"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SignalsListProps {
  signals: Signal[];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays}d`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)}sem`;
  return `hace ${Math.floor(diffDays / 30)}m`;
}

export function SignalsList({ signals }: SignalsListProps) {
  if (signals.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-foreground/10 py-12 text-sm text-muted-foreground">
        Sin signals recientes
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signals ({signals.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {signals.map((signal) => (
            <div key={signal.id} className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-1.5 size-2 rounded-full shrink-0",
                  signal.score < 0 ? "bg-red-400" : signal.score > 0 ? "bg-emerald-400" : "bg-muted-foreground"
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {signal.subtype.replace(/_/g, " ")}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-mono",
                      signal.score < 0 ? "text-red-400" : signal.score > 0 ? "text-emerald-400" : "text-muted-foreground"
                    )}
                  >
                    {signal.score > 0 ? "+" : ""}{signal.score}
                  </span>
                </div>
                {signal.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {signal.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground/60">
                    {timeAgo(signal.detected_at)}
                  </span>
                  <span className="text-xs text-muted-foreground/40 rounded bg-muted/50 px-1.5 py-0.5">
                    {signal.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
