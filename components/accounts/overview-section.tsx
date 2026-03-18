"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  AlertTriangle,
} from "lucide-react";
import { getNum, formatNumber, formatPercent, formatMoney } from "@/lib/metadata-utils";
import { cn } from "@/lib/utils";

interface OverviewSectionProps {
  metadata: Record<string, unknown>;
  mrr: number | null;
}

function StatRow({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: string | null;
  sub?: string;
  alert?: boolean;
}) {
  if (value === null || value === undefined || value === "—") return null;
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className={cn("text-sm font-medium", alert && "text-red-400")}>
          {value}
        </span>
        {sub && (
          <span className="text-xs text-muted-foreground ml-1.5">{sub}</span>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="size-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">{children}</CardContent>
    </Card>
  );
}

export function OverviewSection({ metadata, mrr }: OverviewSectionProps) {
  const m = metadata;

  // Info Core
  const plan = m.plan as string | undefined;
  const industry = m.industry as string | undefined;
  const country = m.country as string | undefined;
  const assignedCsm = (m.assigned_csm || m.crm_assigned_csm) as string | undefined;
  const assignedAe = (m.assigned_ae || m.crm_assigned_ae) as string | undefined;
  const icpTier = (m.icp_tier || m.crm_icp_tier) as string | undefined;
  const partnerName = (m.partner_name || m.crm_partner_name) as string | undefined;

  // Finance
  const facturasVencidas = getNum(m, "facturas_vencidas");
  const montoVencidas = getNum(m, "monto_facturas_vencidas");
  const facturadoPlan = getNum(m, "facturado_plan");
  const excedente = getNum(m, "facturado_excedente_mes_anterior");
  const costoExcedentes = getNum(m, "costo_de_excedentes");
  const periodEnds = m.current_period_ends_at as string | undefined;
  const churnRazon = m.churn_razon as string | undefined;
  const churnOportunidades = m.churn_oportunidades_de_mejora as string | undefined;

  // Usage
  const planConvs = getNum(m, "plan_conversaciones");
  const currentConvs = getNum(m, "conversaciones_actuales");
  const utilization = getNum(m, "conversaciones_actuales_vs_plan");
  const util3m = getNum(m, "conversaciones_vs_plan_3m");
  const projectedRevenue = getNum(m, "revenue_proyectado");
  const convStarted = getNum(m, "conversations_started");
  const abandonment = getNum(m, "tasa_abandono");
  const nds = getNum(m, "nds_pct");
  const activeUsers = getNum(m, "total_active_users");

  // Experience
  const totalCalls30d = getNum(m, "total_calls_30d");
  const intercomConvs = getNum(m, "intercom_convs_30d");
  const lastCalendar = m.last_calendar_interaction as string | undefined;
  const lastEmail = m.last_email_interaction as string | undefined;

  const utilizationPct =
    utilization !== null
      ? utilization <= 1
        ? utilization * 100
        : utilization
      : null;
  const utilizationColor =
    utilizationPct !== null
      ? utilizationPct < 50
        ? "text-amber-400"
        : utilizationPct > 90
          ? "text-emerald-400"
          : "text-blue-400"
      : "";

  const hasFinanceData =
    facturasVencidas !== null ||
    facturadoPlan !== null ||
    excedente !== null ||
    periodEnds;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Info Core */}
      <SectionCard icon={Building2} title="Info Core">
        <StatRow label="Plan" value={plan || null} />
        <StatRow label="MRR" value={mrr ? formatMoney(mrr) : null} />
        <StatRow label="Industry" value={industry || null} />
        <StatRow label="Country" value={country || null} />
        <StatRow label="ICP Tier" value={icpTier || null} />
        <StatRow label="CSM" value={assignedCsm || null} />
        <StatRow label="AE" value={assignedAe || null} />
        <StatRow label="Partner" value={partnerName || null} />
        {!plan && !assignedCsm && !icpTier && (
          <p className="text-sm text-muted-foreground py-2">
            Sin datos de perfil disponibles.
          </p>
        )}
      </SectionCard>

      {/* Finance */}
      <SectionCard icon={CreditCard} title="Finance">
        {hasFinanceData ? (
          <>
            {facturadoPlan !== null && (
              <StatRow
                label="Facturado Plan"
                value={formatMoney(facturadoPlan)}
              />
            )}
            {excedente !== null && excedente > 0 && (
              <StatRow
                label="Excedente Mes Anterior"
                value={formatMoney(excedente)}
              />
            )}
            {costoExcedentes !== null && costoExcedentes > 0 && (
              <StatRow
                label="Costo Excedentes"
                value={formatMoney(costoExcedentes)}
              />
            )}
            {facturasVencidas !== null && facturasVencidas > 0 && (
              <StatRow
                label="Facturas Vencidas"
                value={`${facturasVencidas}`}
                sub={
                  montoVencidas ? `($${formatNumber(montoVencidas)})` : undefined
                }
                alert
              />
            )}
            {facturasVencidas !== null && facturasVencidas === 0 && (
              <StatRow label="Facturas Vencidas" value="0" sub="✓ al día" />
            )}
            {periodEnds && (
              <StatRow label="Fin Periodo Actual" value={periodEnds} />
            )}
            {churnRazon && (
              <div className="mt-2 rounded-md bg-red-400/10 border border-red-400/20 p-2">
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium mb-1">
                  <AlertTriangle className="size-3" /> Churn Alert
                </div>
                <p className="text-xs text-muted-foreground">{churnRazon}</p>
                {churnOportunidades && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Oportunidades: {churnOportunidades}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            Sin datos financieros disponibles.
          </p>
        )}
      </SectionCard>

      {/* Usage */}
      <SectionCard icon={BarChart3} title="Usage">
        {planConvs !== null && (
          <StatRow label="Plan" value={formatNumber(planConvs)} sub="convs" />
        )}
        {currentConvs !== null && (
          <StatRow label="Actuales" value={formatNumber(currentConvs)} />
        )}
        {utilizationPct !== null && (
          <>
            <StatRow label="Utilización" value={`${utilizationPct.toFixed(0)}%`} />
            <div className="space-y-1 pb-1">
              <Progress
                value={Math.min(utilizationPct, 100)}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className={cn("font-medium", utilizationColor)}>
                  {utilizationPct.toFixed(0)}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </>
        )}
        {util3m !== null && (
          <StatRow
            label="Utilización 3M"
            value={formatPercent(util3m <= 1 ? util3m : util3m / 100)}
          />
        )}
        {projectedRevenue !== null && (
          <StatRow label="Revenue Proy." value={formatMoney(projectedRevenue)} />
        )}
        {abandonment !== null && (
          <StatRow label="Tasa Abandono" value={formatPercent(abandonment)} />
        )}
        {nds !== null && (
          <StatRow label="NDS" value={formatPercent(nds)} />
        )}
        {activeUsers !== null && (
          <StatRow label="Usuarios Activos" value={formatNumber(activeUsers)} />
        )}
        {convStarted !== null && (
          <StatRow
            label="Convs Started"
            value={formatNumber(convStarted)}
            sub="snapshot"
          />
        )}
        {planConvs === null && currentConvs === null && convStarted === null && (
          <p className="text-sm text-muted-foreground py-2">
            Sin datos de consumo disponibles.
          </p>
        )}
      </SectionCard>

      {/* Experience */}
      <SectionCard icon={HeadphonesIcon} title="Experience">
        {totalCalls30d !== null && (
          <StatRow label="Calls (30d)" value={formatNumber(totalCalls30d)} />
        )}
        {intercomConvs !== null && (
          <StatRow label="Support Convs (30d)" value={formatNumber(intercomConvs)} />
        )}
        {lastCalendar && (
          <StatRow label="Last Calendar" value={lastCalendar} />
        )}
        {lastEmail && (
          <StatRow label="Last Email" value={lastEmail} />
        )}
        {!totalCalls30d && !intercomConvs && !lastCalendar && !lastEmail && (
          <p className="text-sm text-muted-foreground py-2">
            Sin datos de experiencia disponibles.
          </p>
        )}
      </SectionCard>
    </div>
  );
}
