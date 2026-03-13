"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMRR } from "@/lib/health-utils";
import type { LifecycleBucket } from "@/lib/types";

interface LifecycleBarChartProps {
  data: LifecycleBucket[];
}

function formatStage(stage: string): string {
  return stage.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: LifecycleBucket }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{formatStage(d.stage)}</p>
      <p className="text-muted-foreground">{d.count} clients</p>
      <p className="text-muted-foreground">Avg Health: {d.avg_health !== null ? Math.round(d.avg_health) : "N/A"}</p>
      <p className="text-muted-foreground">MRR: {formatMRR(d.mrr)}</p>
    </div>
  );
}

export function LifecycleBarChart({ data }: LifecycleBarChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatStage(d.stage),
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Lifecycle Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
              <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
