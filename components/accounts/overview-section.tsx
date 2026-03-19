"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Building2,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  AlertTriangle,
  Database,
} from "lucide-react";
import { getNum, formatNumber, formatPercent, formatMoney } from "@/lib/metadata-utils";
import { FIELD_SOURCES, METRIC_THRESHOLDS, type FieldSource } from "@/lib/field-sources";
import { cn } from "@/lib/utils";

interface OverviewSectionProps {
  metadata: Record<string, unknown>;
  mrr: number | null;
}

// Build a lookup map: field name → FieldSource
const FIELD_MAP = new Map<string, FieldSource>();
for (const f of FIELD_SOURCES) {
  FIELD_MAP.set(f.field, f);
}

function SourceTooltipContent({ field }: { field: string }) {
  const src = FIELD_MAP.get(field);
  if (!src) return <span>Source: unknown</span>;

  const d = src.sourceDetail;
  return (
    <div className="space-y-1.5 max-w-xs">
      <div className="font-medium">{src.label}</div>
      {src.meaning && (
        <div className="text-xs text-muted-foreground leading-relaxed">
          {src.meaning}
        </div>
      )}
      <div className="border-t border-border/50 pt-1.5">
        <div className={cn("text-xs", src.sourceColor)}>
          {src.source}
        </div>
        {d.project && (
          <div className="text-xs opacity-80">
            {d.project}.{d.dataset}.{d.table}
            {d.column && <span className="opacity-60"> → {d.column}</span>}
          </div>
        )}
        {d.apiEndpoint && (
          <div className="text-xs opacity-80">{d.apiEndpoint}</div>
        )}
        {d.notes && (
          <div className="text-xs opacity-60 italic">{d.notes}</div>
        )}
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  sub,
  alert,
  field,
  rawValue,
}: {
  label: string;
  value: string | null;
  sub?: string;
  alert?: boolean;
  field?: string; // metadata field name for source lookup
  rawValue?: number | null; // numeric value for threshold color-coding
}) {
  if (value === null || value === undefined || value === "—") return null;

  const hasSrc = field && FIELD_MAP.has(field);

  // A2: Threshold-based color-coding
  let thresholdColor: string | null = null;
  if (!alert && field && rawValue !== null && rawValue !== undefined) {
    const fn = METRIC_THRESHOLDS[field];
    if (fn) thresholdColor = fn(rawValue);
  }

  const labelEl = (
    <span className={cn(
      "text-sm text-muted-foreground",
      hasSrc && "border-b border-dotted border-muted-foreground/40 cursor-help"
    )}>
      {label}
    </span>
  );

  return (
    <div className="flex items-center justify-between py-1.5">
      {hasSrc ? (
        <Tooltip>
          <TooltipTrigger className="text-left">
            <span className="inline-flex items-center gap-1">
              <Database className="size-3 text-muted-foreground/40" />
              {labelEl}
            </span>
          </TooltipTrigger>
          <TooltipContent side="left" align="start" className="max-w-xs">
            <SourceTooltipContent field={field!} />
          </TooltipContent>
        </Tooltip>
      ) : (
        labelEl
      )}
      <div className="text-right">
        <span className={cn(
          "text-sm font-medium",
          alert && "text-red-400",
          !alert && thresholdColor,
        )}>
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
  const lastCalendar = (m.last_calendar_interaction || m.crm_last_calendar_interaction) as string | undefined;
  const lastEmail = (m.last_email_interaction || m.crm_last_email_interaction) as string | undefined;

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
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Info Core */}
        <SectionCard icon={Building2} title="Info Core">
          <StatRow label="Plan" value={plan || null} field="plan" />
          <StatRow label="MRR" value={mrr ? formatMoney(mrr) : null} field="mrr" />
          <StatRow label="Industry" value={industry || null} field="industry" />
          <StatRow label="Country" value={country || null} field="country" />
          <StatRow label="ICP Tier" value={icpTier || null} field="icp_tier" />
          <StatRow label="CSM" value={assignedCsm || null} field="assigned_csm" />
          <StatRow label="AE" value={assignedAe || null} field="assigned_ae" />
          <StatRow label="Partner" value={partnerName || null} field="partner_name" />
          <StatRow label="Contexto" value={m.contexto_empresa as string || null} field="contexto_empresa" />
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
                <StatRow label="Facturado Plan" value={formatMoney(facturadoPlan)} field="facturado_plan" />
              )}
              {excedente !== null && excedente > 0 && (
                <StatRow label="Excedente Mes Anterior" value={formatMoney(excedente)} field="facturado_excedente_mes_anterior" />
              )}
              {costoExcedentes !== null && costoExcedentes > 0 && (
                <StatRow label="Costo Excedentes" value={formatMoney(costoExcedentes)} />
              )}
              {facturasVencidas !== null && facturasVencidas > 0 && (
                <StatRow
                  label="Facturas Vencidas"
                  value={`${facturasVencidas}`}
                  sub={montoVencidas ? `($${formatNumber(montoVencidas)})` : undefined}
                  alert
                  field="facturas_vencidas"
                />
              )}
              {facturasVencidas !== null && facturasVencidas === 0 && (
                <StatRow label="Facturas Vencidas" value="0" sub="al dia" field="facturas_vencidas" rawValue={0} />
              )}
              {periodEnds && (
                <StatRow label="Fin Periodo Actual" value={periodEnds} field="current_period_ends_at" />
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
            <StatRow label="Plan" value={formatNumber(planConvs)} sub="convs" field="plan_conversaciones" />
          )}
          {currentConvs !== null && (
            <StatRow label="Actuales" value={formatNumber(currentConvs)} field="conversaciones_actuales" />
          )}
          {utilizationPct !== null && (
            <>
              <StatRow label="Utilizacion" value={`${utilizationPct.toFixed(0)}%`} field="conversaciones_actuales_vs_plan" rawValue={utilization} />
              <div className="space-y-1 pb-1">
                <Progress value={Math.min(utilizationPct, 100)} className="h-2" />
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
              label="Utilizacion 3M"
              value={formatPercent(util3m <= 1 ? util3m : util3m / 100)}
              field="conversaciones_vs_plan_3m"
              rawValue={util3m}
            />
          )}
          {projectedRevenue !== null && (
            <StatRow label="Revenue Proy." value={formatMoney(projectedRevenue)} field="revenue_proyectado" />
          )}
          {abandonment !== null && (
            <StatRow label="Tasa Abandono" value={formatPercent(abandonment)} field="tasa_abandono" rawValue={abandonment} />
          )}
          {nds !== null && (
            <StatRow label="NDS" value={formatPercent(nds)} field="nds_pct" rawValue={nds} />
          )}
          {activeUsers !== null && (
            <StatRow label="Usuarios Activos" value={formatNumber(activeUsers)} field="total_active_users" />
          )}
          {convStarted !== null && (
            <StatRow label="Convs Started" value={formatNumber(convStarted)} sub="snapshot" field="conversations_started" />
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
            <StatRow label="Calls (30d)" value={formatNumber(totalCalls30d)} field="total_calls_30d" />
          )}
          {intercomConvs !== null && (
            <StatRow label="Support Convs (30d)" value={formatNumber(intercomConvs)} field="intercom_convs_30d" />
          )}
          {lastCalendar && (
            <StatRow label="Last Calendar" value={lastCalendar} field="crm_last_calendar_interaction" />
          )}
          {lastEmail && (
            <StatRow label="Last Email" value={lastEmail} field="crm_last_email_interaction" />
          )}
          {!totalCalls30d && !intercomConvs && !lastCalendar && !lastEmail && (
            <p className="text-sm text-muted-foreground py-2">
              Sin datos de experiencia disponibles.
            </p>
          )}
        </SectionCard>
      </div>
    </TooltipProvider>
  );
}
