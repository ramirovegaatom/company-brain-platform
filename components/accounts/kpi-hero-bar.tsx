"use client";

import { DollarSign, Activity, Phone, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getHealthColor } from "@/lib/health-utils";
import { getNum, formatPercent } from "@/lib/metadata-utils";
import type { Client, HealthTrend } from "@/lib/types";

interface KpiHeroBarProps {
  client: Client;
  healthTrend?: HealthTrend;
}

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  colorClass?: string;
}

function KpiCard({ icon, label, value, sub, colorClass }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-card p-4 flex flex-col items-center text-center gap-1">
      <div className="text-muted-foreground">{icon}</div>
      <div className={cn("text-2xl font-bold tracking-tight", colorClass)}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70">{sub}</div>}
    </div>
  );
}

export function KpiHeroBar({ client, healthTrend }: KpiHeroBarProps) {
  const meta = client.metadata || {};
  const mrr = client.mrr;
  const health = client.health_score;

  const utilization = getNum(meta, "conversaciones_actuales_vs_plan");
  const calls30d = getNum(meta, "total_calls_30d");

  const trendLabel = healthTrend === "improving" ? "improving" : healthTrend === "declining" ? "declining" : "stable";
  const healthColors = getHealthColor(health);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <KpiCard
        icon={<DollarSign className="size-5" />}
        label="MRR"
        value={mrr ? `$${mrr.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}
        sub={client.plan || undefined}
      />
      <KpiCard
        icon={<Activity className="size-5" />}
        label="Utilization"
        value={formatPercent(utilization)}
        sub={utilization !== null && utilization < 0.5 ? "below pace" : undefined}
        colorClass={utilization !== null && utilization < 0.5 ? "text-amber-400" : utilization !== null && utilization > 0.9 ? "text-emerald-400" : undefined}
      />
      <KpiCard
        icon={<Phone className="size-5" />}
        label="Calls (30d)"
        value={calls30d !== null ? String(calls30d) : "—"}
      />
      <KpiCard
        icon={<Heart className="size-5" />}
        label="Health"
        value={health !== null ? `${health}` : "—"}
        sub={trendLabel}
        colorClass={healthColors.split(" ").find(c => c.startsWith("text-"))}
      />
    </div>
  );
}
