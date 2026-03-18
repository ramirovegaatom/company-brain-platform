"use client";

import { FlowNode } from "@/components/data-map/flow-node";
import { FlowConnector, FlowLabel, aroundPositions } from "@/components/data-map/flow-shared";
import {
  getSourceKeysForClient,
  SOURCE_LABELS,
  SIGNAL_SOURCE_MAP,
} from "@/lib/field-sources";
import type { Client, Signal } from "@/lib/types";
import { getNum } from "@/lib/metadata-utils";

interface AccountFlowViewProps {
  client: Client;
  signals: Signal[];
  selectedSourceId: string | null;
  onSelectSource: (id: string) => void;
}

// Source nodes with their display config
const SOURCES = [
  { id: "vitally", color: "purple" as const, statFn: (m: Record<string, unknown>) => {
    const h = m.vitally_health_score;
    return h !== null && h !== undefined ? `Health: ${h}/10` : undefined;
  }},
  { id: "bigquery", color: "blue" as const, statFn: (m: Record<string, unknown>) => {
    const c = m.conversations_started;
    return c ? `${Number(c).toLocaleString()} convs` : undefined;
  }},
  { id: "adoption", color: "cyan" as const, statFn: (m: Record<string, unknown>) => {
    const b = m.bots_conectados;
    return b ? `${b} bots` : undefined;
  }},
  { id: "modjo", color: "amber" as const, statFn: (m: Record<string, unknown>) => {
    const c = m.total_calls_30d;
    return c ? `${c} calls (30d)` : undefined;
  }},
  { id: "labs", color: "cyan" as const, statFn: (m: Record<string, unknown>) => {
    const c = m.labs_total_conversations_30d;
    return c ? `${Number(c).toLocaleString()} convs` : undefined;
  }},
  { id: "conv_logs", color: "emerald" as const, statFn: (m: Record<string, unknown>) => {
    const c = m.conv_logs_total_30d;
    return c ? `${Number(c).toLocaleString()} convs` : undefined;
  }},
];

const PROCESSING = [
  { id: "health", title: "Health Scoring", color: "blue" as const },
  { id: "patterns", title: "Pattern Matching", color: "blue" as const },
  { id: "context", title: "Context Card", color: "blue" as const },
  { id: "kb", title: "KB Search", color: "blue" as const },
];

export function AccountFlowView({
  client,
  signals,
  selectedSourceId,
  onSelectSource,
}: AccountFlowViewProps) {
  const meta = client.metadata || {};
  const clientFields = client as unknown as Record<string, unknown>;

  // Determine which sources have data for this client
  const activeFieldSources = getSourceKeysForClient(meta, clientFields);

  // Also check signals
  for (const sig of signals) {
    const key = SIGNAL_SOURCE_MAP[sig.source];
    if (key) activeFieldSources.add(key);
  }

  const signalCount = signals.length;
  const srcXs = aroundPositions(SOURCES.length);
  const procXs = aroundPositions(PROCESSING.length);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px] pb-2">
        {/* Row 1: Data Sources */}
        <div className="flex justify-around items-start px-2">
          {SOURCES.map((s) => {
            const isActive = activeFieldSources.has(s.id);
            const stat = s.statFn(meta);
            return (
              <FlowNode
                key={s.id}
                id={s.id}
                title={SOURCE_LABELS[s.id] || s.id}
                stats={isActive ? stat : "No data"}
                color={s.color}
                dimmed={!isActive}
                selected={selectedSourceId === s.id}
                onClick={onSelectSource}
              />
            );
          })}
        </div>

        {/* Connector: sources → supabase */}
        <FlowConnector fromXs={srcXs} toXs={[500]} height={55} />
        <FlowLabel text={`${activeFieldSources.size} active sources`} />

        {/* Row 2: Supabase (client-specific) */}
        <div className="flex justify-center px-4">
          <FlowNode
            id="supabase"
            title="Supabase"
            stats={`${signalCount} signals`}
            color="emerald"
            large
            selected={selectedSourceId === "supabase"}
            onClick={onSelectSource}
          />
        </div>

        {/* Connector: supabase → processing */}
        <FlowConnector fromXs={[500]} toXs={procXs} height={55} />
        <FlowLabel text="Intelligence Layer" />

        {/* Row 3: Processing */}
        <div className="flex justify-around items-start px-2">
          {PROCESSING.map((p) => (
            <FlowNode
              key={p.id}
              id={p.id}
              title={p.title}
              color={p.color}
              selected={selectedSourceId === p.id}
              onClick={onSelectSource}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
