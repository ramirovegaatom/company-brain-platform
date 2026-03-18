"use client";

import { cn } from "@/lib/utils";
import { getHealthColor } from "@/lib/health-utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { HealthBreakdown as HealthBreakdownType, HealthFactor } from "@/lib/types";

interface HealthBreakdownProps {
  breakdown: HealthBreakdownType | null;
  isLoading: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  usage: "Usage",
  engagement: "Engagement",
  contract: "Contract",
  support: "Support",
  patterns: "Patterns",
};

const CATEGORY_DESC: Record<string, string> = {
  usage: "Message consumption, abandonment, feature adoption",
  engagement: "Calls, NPS, user activity, response rates",
  contract: "MRR trends, revenue projection, renewals",
  support: "Ticket volume, response times, resolution",
  patterns: "Churn risk, expansion signals, stall patterns",
};

function FactorPill({ factor }: { factor: HealthFactor }) {
  const isNegative = factor.impact < 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] leading-tight",
        isNegative
          ? "bg-red-400/10 text-red-400"
          : "bg-emerald-400/10 text-emerald-400"
      )}
    >
      <span>{isNegative ? "↓" : "↑"}</span>
      <span className="truncate max-w-[200px]">{factor.signal}</span>
    </span>
  );
}

export function HealthBreakdown({ breakdown, isLoading }: HealthBreakdownProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-foreground/10 bg-card p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (!breakdown) return null;

  return (
    <div className="rounded-xl border border-foreground/10 bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Health Breakdown</h3>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-xl font-bold", getHealthColor(breakdown.score))}>
            {breakdown.score}
          </span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {breakdown.categories.map((cat) => (
          <div key={cat.category} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {CATEGORY_LABELS[cat.category] || cat.category}
                <span className="ml-1 text-muted-foreground/50">
                  {Math.round(cat.weight * 100)}%
                </span>
              </span>
              <span className={cn("font-mono font-medium", getHealthColor(cat.score))}>
                {cat.score}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-foreground/5 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  cat.score >= 80 ? "bg-emerald-400" :
                  cat.score >= 60 ? "bg-blue-400" :
                  cat.score >= 40 ? "bg-amber-400" :
                  "bg-red-400"
                )}
                style={{ width: `${cat.score}%` }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground/40 mt-0.5 hidden group-hover:block">
              {CATEGORY_DESC[cat.category]}
            </div>
          </div>
        ))}
      </div>

      {(breakdown.top_risk_factors.length > 0 || breakdown.top_positive_factors.length > 0) && (
        <div className="border-t border-foreground/5 pt-3 space-y-2">
          {breakdown.top_risk_factors.length > 0 && (
            <div>
              <div className="text-[11px] text-muted-foreground/60 mb-1.5">Top Risk Factors</div>
              <div className="flex flex-wrap gap-1.5">
                {breakdown.top_risk_factors.slice(0, 3).map((f, i) => (
                  <FactorPill key={i} factor={f} />
                ))}
              </div>
            </div>
          )}
          {breakdown.top_positive_factors.length > 0 && (
            <div>
              <div className="text-[11px] text-muted-foreground/60 mb-1.5">Positive Signals</div>
              <div className="flex flex-wrap gap-1.5">
                {breakdown.top_positive_factors.slice(0, 3).map((f, i) => (
                  <FactorPill key={i} factor={f} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
