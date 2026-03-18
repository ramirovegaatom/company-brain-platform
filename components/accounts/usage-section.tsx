"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { getNum, formatNumber, formatPercent, formatMoney } from "@/lib/metadata-utils";
import { cn } from "@/lib/utils";

interface UsageSectionProps {
  metadata: Record<string, unknown>;
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium">{value}</span>
        {sub && <span className="text-xs text-muted-foreground ml-1.5">{sub}</span>}
      </div>
    </div>
  );
}

export function UsageSection({ metadata }: UsageSectionProps) {
  const planConvs = getNum(metadata, "plan_conversaciones");
  const currentConvs = getNum(metadata, "conversaciones_actuales");
  const utilization = getNum(metadata, "conversaciones_actuales_vs_plan");
  const projectedRevenue = getNum(metadata, "revenue_proyectado");
  const convStarted = getNum(metadata, "conversations_started");
  const abandonment = getNum(metadata, "tasa_abandono");
  const nds = getNum(metadata, "nds_pct");
  const activeUsers = getNum(metadata, "total_active_users");

  const hasData = planConvs !== null || currentConvs !== null || convStarted !== null;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="size-4" /> Consumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sin datos de consumo disponibles.</p>
        </CardContent>
      </Card>
    );
  }

  const utilizationPct = utilization !== null ? (utilization <= 1 ? utilization * 100 : utilization) : null;
  const utilizationColor = utilizationPct !== null
    ? utilizationPct < 50 ? "text-amber-400" : utilizationPct > 90 ? "text-emerald-400" : "text-blue-400"
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="size-4" /> Consumo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {planConvs !== null && (
          <StatRow label="Plan (conversaciones contratadas)" value={formatNumber(planConvs)} />
        )}
        {currentConvs !== null && (
          <StatRow label="Conversaciones actuales" value={formatNumber(currentConvs)} />
        )}
        {utilizationPct !== null && (
          <>
            <StatRow
              label="Utilización actual"
              value={`${utilizationPct.toFixed(0)}%`}
            />
            <div className="space-y-1">
              <Progress value={Math.min(utilizationPct, 100)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className={cn("font-medium", utilizationColor)}>
                  {utilizationPct.toFixed(0)}% de {formatNumber(planConvs)}
                </span>
                <span>100%</span>
              </div>
            </div>
          </>
        )}
        {projectedRevenue !== null && (
          <StatRow label="Revenue proyectado" value={formatMoney(projectedRevenue)} />
        )}
        {abandonment !== null && (
          <StatRow label="Tasa de abandono" value={formatPercent(abandonment)} />
        )}
        {nds !== null && (
          <StatRow label="NDS (nivel de servicio)" value={formatPercent(nds)} />
        )}
        {activeUsers !== null && (
          <StatRow label="Usuarios activos" value={formatNumber(activeUsers)} />
        )}
      </CardContent>
    </Card>
  );
}
