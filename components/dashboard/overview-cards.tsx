"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, AlertTriangle, XCircle, ShieldAlert } from "lucide-react";
import { formatMRR } from "@/lib/health-utils";
import type { DashboardSummary } from "@/lib/types";

interface OverviewCardsProps {
  data: DashboardSummary;
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      label: "Total Clients",
      value: data.total_clients.toLocaleString(),
      icon: Users,
      color: "text-slate-300",
    },
    {
      label: "Total MRR",
      value: formatMRR(data.total_mrr),
      icon: DollarSign,
      color: "text-emerald-400",
    },
    {
      label: "MRR at Risk",
      value: formatMRR(data.mrr_at_risk),
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      label: "Critical",
      value: data.count_critical.toString(),
      icon: XCircle,
      color: "text-red-400",
    },
    {
      label: "At Risk",
      value: data.count_at_risk.toString(),
      icon: ShieldAlert,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`size-4 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
