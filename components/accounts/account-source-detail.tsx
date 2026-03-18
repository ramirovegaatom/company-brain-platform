"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Database, Globe, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFieldsByTable,
  SOURCE_LABELS,
  SOURCE_COLORS,
  SIGNAL_SOURCE_MAP,
} from "@/lib/field-sources";
import type { Client, Signal } from "@/lib/types";

interface AccountSourceDetailProps {
  sourceId: string;
  client: Client;
  signals: Signal[];
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    if (value >= 0 && value <= 1 && value !== 0) return `${(value * 100).toFixed(1)}%`;
    return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (typeof value[0] === "object") return `${value.length} items`;
    return value.slice(0, 3).join(", ") + (value.length > 3 ? ` +${value.length - 3}` : "");
  }
  const s = String(value);
  return s.length > 40 ? s.slice(0, 37) + "..." : s;
}

export function AccountSourceDetail({ sourceId, client, signals }: AccountSourceDetailProps) {
  const meta = client.metadata || {};
  const clientFields = client as unknown as Record<string, unknown>;
  const label = SOURCE_LABELS[sourceId] || sourceId;
  const color = SOURCE_COLORS[sourceId] || "text-muted-foreground";
  const byTable = getFieldsByTable(sourceId);

  // Count signals from this source
  const sourceSignalKeys = Object.entries(SIGNAL_SOURCE_MAP)
    .filter(([, key]) => key === sourceId)
    .map(([src]) => src);
  const sourceSignals = signals.filter((s) => sourceSignalKeys.includes(s.source));

  // Check if any fields have data
  let totalFields = 0;
  let availableFields = 0;
  for (const [, fields] of byTable) {
    for (const f of fields) {
      totalFields++;
      const v = meta[f.field] ?? clientFields[f.field];
      if (v !== null && v !== undefined && v !== "" && v !== 0) availableFields++;
    }
  }
  const isActive = availableFields > 0 || sourceSignals.length > 0;

  return (
    <Card className="mt-3 border-foreground/10">
      <CardContent className="pt-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {sourceId === "computed" ? (
              <Cpu className={cn("size-4", color)} />
            ) : sourceId === "vitally" ? (
              <Globe className={cn("size-4", color)} />
            ) : (
              <Database className={cn("size-4", color)} />
            )}
            <span className={cn("text-sm font-semibold", color)}>{label}</span>
            <span className={cn(
              "text-[10px] rounded-full px-2 py-0.5",
              isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-muted text-muted-foreground"
            )}>
              {isActive ? "Active" : "No data"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {availableFields}/{totalFields} fields
          </span>
        </div>

        {/* Connection Details */}
        {byTable.size > 0 && (
          <div className="space-y-3">
            {Array.from(byTable.entries()).map(([table, fields]) => {
              const detail = fields[0]?.sourceDetail;
              return (
                <div key={table}>
                  {/* Table header with BQ path */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {detail?.project && (
                      <span className="text-[10px] font-mono text-muted-foreground/60">
                        {detail.project}
                      </span>
                    )}
                    {detail?.dataset && (
                      <>
                        <span className="text-[10px] text-muted-foreground/40">&rarr;</span>
                        <span className="text-[10px] font-mono text-muted-foreground/70">
                          {detail.dataset}
                        </span>
                      </>
                    )}
                    {detail?.table && (
                      <>
                        <span className="text-[10px] text-muted-foreground/40">&rarr;</span>
                        <span className={cn("text-[10px] font-mono font-medium", color)}>
                          {detail.table}
                        </span>
                      </>
                    )}
                    {detail?.apiEndpoint && !detail.table && (
                      <span className={cn("text-[10px] font-mono", color)}>
                        {detail.apiEndpoint}
                      </span>
                    )}
                  </div>

                  {/* Fields table */}
                  <div className="rounded-md border border-foreground/5 overflow-hidden">
                    {fields.map((f) => {
                      const v = meta[f.field] ?? clientFields[f.field];
                      const hasValue = v !== null && v !== undefined && v !== "" && v !== 0;
                      return (
                        <div
                          key={f.field}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-1 text-xs border-b border-foreground/5 last:border-0",
                            !hasValue && "opacity-40"
                          )}
                        >
                          {hasValue ? (
                            <Check className="size-3 text-emerald-400 shrink-0" />
                          ) : (
                            <X className="size-3 text-muted-foreground/50 shrink-0" />
                          )}
                          <span className="flex-1 min-w-0 truncate">{f.label}</span>
                          {hasValue && (
                            <span className="text-muted-foreground tabular-nums truncate max-w-[120px]">
                              {formatValue(v)}
                            </span>
                          )}
                          {f.sourceDetail.column && (
                            <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">
                              .{f.sourceDetail.column}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Signals from this source */}
        {sourceSignals.length > 0 && (
          <div>
            <div className="text-[11px] text-muted-foreground/60 mb-1.5">
              Signals ({sourceSignals.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sourceSignals.slice(0, 8).map((s, i) => (
                <span
                  key={i}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                    s.score < 0 ? "bg-red-400/10 text-red-400" : "bg-emerald-400/10 text-emerald-400"
                  )}
                >
                  {s.score < 0 ? "↓" : "↑"} {s.subtype}
                </span>
              ))}
              {sourceSignals.length > 8 && (
                <span className="text-[10px] text-muted-foreground">
                  +{sourceSignals.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
