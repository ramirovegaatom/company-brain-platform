"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Check, X } from "lucide-react";
import { getNum, getList, formatNumber, formatMoney } from "@/lib/metadata-utils";
import { cn } from "@/lib/utils";

interface AdoptionSnapshotProps {
  metadata: Record<string, unknown>;
}

interface FeatureItem {
  label: string;
  active: boolean;
  detail?: string;
}

export function AdoptionSnapshot({ metadata }: AdoptionSnapshotProps) {
  const aiCost = getNum(metadata, "total_ai_cost");
  const bots = getNum(metadata, "bots_conectados");
  const waFlows = getNum(metadata, "wa_flows_sended");
  const outbound = getNum(metadata, "outbound_bot_calls");
  const templates = getNum(metadata, "templates_enviadas");
  const hubspot = getNum(metadata, "hubspot_deals");
  const ctwa = getNum(metadata, "ctwa_convs");
  const useCases = getList(metadata, "use_case_list");

  const features: FeatureItem[] = [
    { label: "AI / IA", active: (aiCost ?? 0) > 0, detail: aiCost ? formatMoney(aiCost) : undefined },
    { label: "Bots", active: (bots ?? 0) > 0, detail: bots ? `${bots} connected` : undefined },
    { label: "Outbound", active: (outbound ?? 0) > 0, detail: outbound ? formatNumber(outbound) + " calls" : undefined },
    { label: "WA Flows", active: (waFlows ?? 0) > 0, detail: waFlows ? formatNumber(waFlows) + " sent" : undefined },
    { label: "Templates", active: (templates ?? 0) > 0, detail: templates ? formatNumber(templates) : undefined },
    { label: "HubSpot", active: (hubspot ?? 0) > 0, detail: hubspot ? `${hubspot} deals` : undefined },
    { label: "Click-to-WA", active: (ctwa ?? 0) > 0, detail: ctwa ? formatNumber(ctwa) : undefined },
  ];

  const activeCount = features.filter(f => f.active).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Layers className="size-4" /> Adopción de Features
          </span>
          <span className="text-xs text-muted-foreground font-normal">
            {activeCount}/{features.length} activos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {features.map((f) => (
            <div
              key={f.label}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                f.active
                  ? "border-emerald-400/20 bg-emerald-400/5"
                  : "border-foreground/5 bg-muted/30 text-muted-foreground"
              )}
            >
              {f.active ? (
                <Check className="size-3.5 text-emerald-400 shrink-0" />
              ) : (
                <X className="size-3.5 text-muted-foreground/50 shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{f.label}</div>
                {f.active && f.detail && (
                  <div className="text-xs text-muted-foreground truncate">{f.detail}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {useCases.length > 0 && (
          <div className="mt-3 pt-3 border-t border-foreground/5">
            <div className="text-xs text-muted-foreground mb-1.5">Campaign Categories</div>
            <div className="flex flex-wrap gap-1.5">
              {useCases.map((uc) => (
                <span key={uc} className="inline-flex rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                  {uc}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
