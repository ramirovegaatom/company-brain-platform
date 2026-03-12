"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthBadge } from "./health-badge";
import type { Client, HealthTrend } from "@/lib/types";
import {
  formatMRR,
  formatLifecycleLabel,
  getLifecycleColor,
  getHealthColor,
} from "@/lib/health-utils";
import { cn } from "@/lib/utils";

interface ClientHeaderProps {
  client: Client;
  healthTrend?: HealthTrend;
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

export function ClientHeader({ client, healthTrend }: ClientHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
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
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {client.industry && <span>{client.industry}</span>}
            {client.industry && client.size && <span>·</span>}
            {client.size && <span className="capitalize">{client.size.replace(/_/g, " ")}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HealthBadge score={client.health_score} />
          <TrendIcon trend={healthTrend} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard label="MRR" value={formatMRR(client.mrr)} />
        <MetricCard
          label="Lifecycle"
          value={formatLifecycleLabel(client.lifecycle_stage)}
          badgeClass={getLifecycleColor(client.lifecycle_stage)}
        />
        <MetricCard label="Plan" value={client.plan || "—"} />
        <MetricCard label="ICP Fit" value={client.icp_fit_score !== null ? `${client.icp_fit_score}%` : "—"} />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  badgeClass,
}: {
  label: string;
  value: string;
  badgeClass?: string;
}) {
  return (
    <div className="rounded-lg border border-foreground/10 bg-card p-3">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      {badgeClass ? (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            badgeClass
          )}
        >
          {value}
        </span>
      ) : (
        <div className="text-sm font-medium">{value}</div>
      )}
    </div>
  );
}
