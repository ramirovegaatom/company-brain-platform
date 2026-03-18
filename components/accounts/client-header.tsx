"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthBadge } from "./health-badge";
import type { Client, HealthTrend, HealthBreakdown } from "@/lib/types";
import {
  formatLifecycleLabel,
  getLifecycleColor,
} from "@/lib/health-utils";
import { cn } from "@/lib/utils";

interface ClientHeaderProps {
  client: Client;
  healthTrend?: HealthTrend;
  healthBreakdown?: HealthBreakdown | null;
}

function TrendIcon({ trend }: { trend?: HealthTrend }) {
  if (!trend) return null;
  const iconClass = "size-4";
  switch (trend) {
    case "improving":
      return <TrendingUp className={cn(iconClass, "text-emerald-400")} />;
    case "declining":
      return <TrendingDown className={cn(iconClass, "text-red-400")} />;
    default:
      return <ArrowRight className={cn(iconClass, "text-muted-foreground")} />;
  }
}

export function ClientHeader({ client, healthTrend, healthBreakdown }: ClientHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/accounts")}
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="size-4" />
        Cuentas
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            {client.industry && <span>{client.industry}</span>}
            {client.industry && client.size && <span>·</span>}
            {client.size && <span className="capitalize">{client.size.replace(/_/g, " ")}</span>}
            {client.lifecycle_stage && (
              <>
                <span>·</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    getLifecycleColor(client.lifecycle_stage)
                  )}
                >
                  {formatLifecycleLabel(client.lifecycle_stage)}
                </span>
              </>
            )}
            {client.plan && (
              <>
                <span>·</span>
                <span>{client.plan}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HealthBadge score={healthBreakdown?.score ?? client.health_score} />
          <TrendIcon trend={healthTrend} />
        </div>
      </div>
    </div>
  );
}
