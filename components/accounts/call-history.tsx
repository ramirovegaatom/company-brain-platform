"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown, ChevronUp, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CallSummary } from "@/lib/types";

interface CallHistoryProps {
  summaries: CallSummary[];
  isLoading: boolean;
  error: string | null;
}

function SpicedBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-xs">{value}</div>
    </div>
  );
}

function CallCard({ call }: { call: CallSummary }) {
  const [expanded, setExpanded] = useState(false);

  const date = call.call_date?.slice(0, 10) || "—";
  const durationMin = call.duration_seconds ? Math.round(call.duration_seconds / 60) : null;
  const themes = Object.keys(call.detected_themes || {}).filter(t => t !== "spiced");
  const spiced = (call.detected_themes?.spiced as Record<string, string | null>) || null;
  const hasSpiced = spiced && Object.values(spiced).some(v => v !== null);

  const themeColors: Record<string, string> = {
    churn_risk: "bg-red-400/15 text-red-400",
    negative_sentiment: "bg-amber-400/15 text-amber-400",
    objections: "bg-amber-400/15 text-amber-400",
    expansion: "bg-emerald-400/15 text-emerald-400",
  };

  return (
    <Card size="sm">
      <CardContent className="p-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{date}</span>
                {durationMin && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {durationMin}min
                  </span>
                )}
                {call.ai_score && (
                  <span className="text-xs text-muted-foreground">
                    AI: {Math.round(call.ai_score)}
                  </span>
                )}
              </div>
              {themes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {themes.map(t => (
                    <span key={t} className={cn("rounded-md px-1.5 py-0.5 text-xs", themeColors[t] || "bg-muted text-muted-foreground")}>
                      {t.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
              {(call.participants_external?.length > 0 || call.participants_internal?.length > 0) && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Users className="size-3" />
                  {call.participants_external?.slice(0, 2).join(", ")}
                  {call.participants_internal?.length > 0 && (
                    <span className="text-muted-foreground/50">
                      + {call.participants_internal.slice(0, 2).join(", ")}
                    </span>
                  )}
                </div>
              )}
            </div>
            {expanded ? <ChevronUp className="size-4 text-muted-foreground shrink-0 mt-0.5" /> : <ChevronDown className="size-4 text-muted-foreground shrink-0 mt-0.5" />}
          </div>
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-foreground/5 space-y-3">
            {call.summary && (
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {call.summary.slice(0, 800)}
                {call.summary.length > 800 && "..."}
              </div>
            )}
            {hasSpiced && (
              <div className="rounded-lg bg-muted/30 p-3 space-y-2">
                <div className="text-xs font-medium mb-1">SPICED</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {spiced?.situation && <SpicedBadge label="Situation" value={spiced.situation} />}
                  {spiced?.pain && <SpicedBadge label="Pain" value={spiced.pain} />}
                  {spiced?.impact && <SpicedBadge label="Impact" value={spiced.impact} />}
                  {spiced?.critical_event && <SpicedBadge label="Critical Event" value={spiced.critical_event} />}
                  {spiced?.decision && <SpicedBadge label="Decision" value={spiced.decision} />}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CallHistory({ summaries, isLoading, error }: CallHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Phone className="size-4" /> Llamadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Phone className="size-4" /> Llamadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-400">Error cargando llamadas: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-foreground/10 py-12 text-sm text-muted-foreground">
        Sin llamadas registradas.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground mb-2">
        {summaries.length} llamada{summaries.length !== 1 ? "s" : ""} (últimos 90 días)
      </div>
      {summaries.map((s) => (
        <CallCard key={s.call_id} call={s} />
      ))}
    </div>
  );
}
