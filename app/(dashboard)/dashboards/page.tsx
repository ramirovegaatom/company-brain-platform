"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { HealthDonutChart } from "@/components/dashboard/health-donut-chart";
import { LifecycleBarChart } from "@/components/dashboard/lifecycle-bar-chart";
import { SignalTrendChart } from "@/components/dashboard/signal-trend-chart";
import { PatternHeatmap } from "@/components/dashboard/pattern-heatmap";
import { TopRisksList } from "@/components/dashboard/top-risks-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { DashboardSummary } from "@/lib/types";

function filterByLifecycle(data: DashboardSummary, stage: string): DashboardSummary {
  if (stage === "all") return data;

  // Re-aggregate with only matching lifecycle clients
  // We can't fully re-aggregate (we don't have raw clients), but we can filter what we have
  const filteredLifecycle = data.lifecycle_distribution.filter((l) => l.stage === stage);
  const filteredRisks = data.top_risks.filter((r) => r.lifecycle_stage === stage);

  // Recalculate totals from lifecycle bucket
  const bucket = filteredLifecycle[0];
  const count = bucket?.count ?? 0;
  const mrr = bucket?.mrr ?? 0;

  // Health distribution can't be perfectly filtered client-side, keep as-is for chart shape
  return {
    ...data,
    total_clients: count,
    total_mrr: mrr,
    lifecycle_distribution: filteredLifecycle,
    top_risks: filteredRisks,
  };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[150px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[320px]" />
        <Skeleton className="h-[320px]" />
      </div>
      <Skeleton className="h-[340px]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>
    </div>
  );
}

export default function DashboardsPage() {
  const { data, isLoading, error, refresh } = useDashboard();
  const [lifecycleStage, setLifecycleStage] = useState("all");

  const filtered = useMemo(() => {
    if (!data) return null;
    return filterByLifecycle(data, lifecycleStage);
  }, [data, lifecycleStage]);

  if (isLoading && !data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Portfolio Dashboard</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Portfolio Dashboard</h1>
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <AlertTriangle className="size-10 text-red-400" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={refresh}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!filtered) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
      </div>

      <DashboardFilters
        lifecycleStage={lifecycleStage}
        onLifecycleChange={setLifecycleStage}
        onRefresh={refresh}
        isLoading={isLoading}
      />

      <OverviewCards data={filtered} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HealthDonutChart data={filtered.health_distribution} total={filtered.total_clients} />
        <LifecycleBarChart data={filtered.lifecycle_distribution} />
      </div>

      <SignalTrendChart data={filtered.signal_trends} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PatternHeatmap data={filtered.pattern_heatmap} />
        <TopRisksList data={filtered.top_risks} />
      </div>
    </div>
  );
}
