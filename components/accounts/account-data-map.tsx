"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_SOURCES, CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/field-sources";
import { AccountFlowView } from "./account-flow-view";
import { AccountSourceDetail } from "./account-source-detail";
import type { Client, Signal } from "@/lib/types";

interface AccountDataMapProps {
  client: Client;
  signals: Signal[];
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    if (value >= 0 && value <= 1 && value !== 0) return `${(value * 100).toFixed(1)}%`;
    return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (typeof value[0] === "object") return `${value.length} items`;
    return value.join(", ");
  }
  return String(value);
}

export function AccountDataMap({ client, signals }: AccountDataMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const meta = client.metadata || {};

  const getValue = (field: string): unknown => {
    if (field in meta) return meta[field];
    if (field in client) return (client as unknown as Record<string, unknown>)[field];
    return undefined;
  };

  const available = FIELD_SOURCES.filter((f) => {
    const v = getValue(f.field);
    return v !== null && v !== undefined && v !== "" && v !== 0;
  });
  const total = FIELD_SOURCES.length;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat] || cat,
    fields: FIELD_SOURCES.filter((f) => f.category === cat),
  }));

  const sourcesPresent = new Set(available.map((f) => f.source));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Database className="size-4" /> Data Map
          </span>
          <span className="text-xs text-muted-foreground font-normal">
            {available.length}/{total} fields · {sourcesPresent.size} sources
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flow">
          <TabsList>
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="fields">Fields ({available.length}/{total})</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="mt-3 space-y-0">
            <AccountFlowView
              client={client}
              signals={signals}
              selectedSourceId={selectedId}
              onSelectSource={(id) => setSelectedId((prev) => (prev === id ? null : id))}
            />
            {selectedId && (
              <AccountSourceDetail
                sourceId={selectedId}
                client={client}
                signals={signals}
              />
            )}
          </TabsContent>

          <TabsContent value="fields" className="mt-3 space-y-4">
            {/* Source legend */}
            <div className="flex flex-wrap gap-2">
              {Array.from(sourcesPresent).map((src) => {
                const color = FIELD_SOURCES.find((f) => f.source === src)?.sourceColor || "text-muted-foreground";
                return (
                  <span key={src} className={cn("inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs", color)}>
                    <span className="size-1.5 rounded-full bg-current" />
                    {src}
                  </span>
                );
              })}
            </div>

            {/* Fields by category */}
            {grouped.map(({ category, label, fields }) => {
              const catAvailable = fields.filter((f) => {
                const v = getValue(f.field);
                return v !== null && v !== undefined && v !== "" && v !== 0;
              });

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">{catAvailable.length}/{fields.length}</span>
                  </div>
                  <div className="space-y-0.5">
                    {fields.map((f) => {
                      const value = getValue(f.field);
                      const hasValue = value !== null && value !== undefined && value !== "" && value !== 0;

                      return (
                        <div
                          key={f.field}
                          className={cn(
                            "flex items-center gap-2 rounded px-2 py-1 text-xs",
                            hasValue ? "bg-muted/20" : "opacity-40"
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
                              {formatValue(value)}
                            </span>
                          )}
                          <span className={cn("shrink-0 text-[10px]", f.sourceColor)}>
                            {f.source}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
