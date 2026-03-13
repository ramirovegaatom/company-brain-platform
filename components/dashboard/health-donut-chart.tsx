"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMRR } from "@/lib/health-utils";
import type { HealthBucket } from "@/lib/types";

const COLORS: Record<string, string> = {
  critical: "#f87171",
  at_risk: "#fbbf24",
  stable: "#60a5fa",
  healthy: "#34d399",
};

interface HealthDonutChartProps {
  data: HealthBucket[];
  total: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: HealthBucket }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium capitalize">{d.label}</p>
      <p className="text-muted-foreground">{d.count} clients</p>
      <p className="text-muted-foreground">MRR: {formatMRR(d.mrr)}</p>
    </div>
  );
}

export function HealthDonutChart({ data, total }: HealthDonutChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Health Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="count"
                nameKey="label"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.label} fill={COLORS[entry.label] || "#64748b"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">clients</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-1.5 text-xs">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[d.label] }} />
              <span className="capitalize text-muted-foreground">{d.label}</span>
              <span className="font-medium text-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
