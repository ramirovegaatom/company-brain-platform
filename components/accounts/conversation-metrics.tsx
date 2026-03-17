"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { getNum, formatNumber, formatPercent } from "@/lib/metadata-utils";
import { cn } from "@/lib/utils";

interface ConversationMetricsProps {
  metadata: Record<string, unknown>;
}

function MiniStat({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div className="rounded-lg border border-foreground/5 bg-muted/30 p-3 text-center">
      <div className={cn("text-lg font-bold", colorClass)}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export function ConversationMetrics({ metadata }: ConversationMetricsProps) {
  // Conv logs (granular)
  const convTotal = getNum(metadata, "conv_logs_total_30d");
  const inboundPct = getNum(metadata, "conv_logs_inbound_pct");
  const outboundPct = getNum(metadata, "conv_logs_outbound_pct");
  const funnelPct = getNum(metadata, "conv_logs_funnel_progression_pct");
  const noResponsePct = getNum(metadata, "conv_logs_no_response_pct");
  const avgEvents = getNum(metadata, "conv_logs_avg_events");
  const distinctFlows = getNum(metadata, "conv_logs_distinct_flows");

  // Labs (aggregate)
  const labsTotal = getNum(metadata, "labs_total_conversations_30d");
  const labsBotPct = getNum(metadata, "labs_bot_handled_pct");
  const labsHumanPct = getNum(metadata, "labs_human_handled_pct");
  const labsAvgMsgs = getNum(metadata, "labs_avg_messages");
  const labsTopFlow = metadata["labs_top_flow_name"] as string | undefined;

  const hasConvLogs = convTotal !== null;
  const hasLabs = labsTotal !== null;

  if (!hasConvLogs && !hasLabs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageCircle className="size-4" /> Conversaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sin datos de conversaciones.</p>
        </CardContent>
      </Card>
    );
  }

  const noResponseColor = noResponsePct !== null && noResponsePct > 0.3
    ? "text-red-400" : noResponsePct !== null && noResponsePct > 0.15
    ? "text-amber-400" : "text-emerald-400";

  const funnelColor = funnelPct !== null && funnelPct < 0.05
    ? "text-red-400" : funnelPct !== null && funnelPct > 0.15
    ? "text-emerald-400" : "text-amber-400";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageCircle className="size-4" /> Conversaciones (30d)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {convTotal !== null && (
            <MiniStat label="Total convs" value={formatNumber(convTotal)} />
          )}
          {labsTotal !== null && !hasConvLogs && (
            <MiniStat label="Total convs" value={formatNumber(labsTotal)} />
          )}
          {inboundPct !== null && (
            <MiniStat label="Inbound" value={formatPercent(inboundPct)} />
          )}
          {outboundPct !== null && (
            <MiniStat label="Outbound" value={formatPercent(outboundPct)} />
          )}
          {funnelPct !== null && (
            <MiniStat label="Funnel progression" value={formatPercent(funnelPct)} colorClass={funnelColor} />
          )}
          {noResponsePct !== null && (
            <MiniStat label="Sin respuesta" value={formatPercent(noResponsePct)} colorClass={noResponseColor} />
          )}
          {avgEvents !== null && (
            <MiniStat label="Avg events/conv" value={avgEvents.toFixed(1)} />
          )}
          {distinctFlows !== null && (
            <MiniStat label="Flujos distintos" value={String(distinctFlows)} />
          )}
          {labsBotPct !== null && (
            <MiniStat label="Bot handled" value={formatPercent(labsBotPct)} />
          )}
          {labsHumanPct !== null && (
            <MiniStat label="Human handled" value={formatPercent(labsHumanPct)} />
          )}
          {labsAvgMsgs !== null && (
            <MiniStat label="Avg msgs/conv" value={labsAvgMsgs.toFixed(1)} />
          )}
        </div>
        {labsTopFlow && (
          <div className="text-xs text-muted-foreground">
            Top flow: <span className="font-medium text-foreground">{labsTopFlow}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
