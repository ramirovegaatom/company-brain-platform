"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SignalWeekBucket } from "@/lib/types";

interface SignalTrendChartProps {
  data: SignalWeekBucket[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name === "positive" ? "Positive" : p.name === "negative" ? "Negative" : "Net Score"}: {p.name === "net_score" ? p.value.toFixed(0) : p.value}
        </p>
      ))}
    </div>
  );
}

export function SignalTrendChart({ data }: SignalTrendChartProps) {
  // Format week labels shorter
  const chartData = data.map((d) => ({
    ...d,
    shortWeek: d.week.replace(/^\d{4}-/, ""),
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Signal Trends (90d)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="gradPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="shortWeek"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="positive"
                stroke="#34d399"
                fill="url(#gradPositive)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="negative"
                stroke="#f87171"
                fill="url(#gradNegative)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="text-muted-foreground">Positive signals</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="text-muted-foreground">Negative signals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
