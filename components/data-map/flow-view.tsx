"use client";

import {
  DATA_SOURCES,
  KNOWLEDGE_SOURCES,
  STUB_SOURCES,
  PLANNED_SOURCES,
  PROCESSING_STEPS,
  OUTPUTS,
} from "@/lib/architecture-data";
import { FlowNode } from "./flow-node";
import { FlowConnector, FlowLabel, aroundPositions } from "./flow-shared";

interface FlowViewProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// ── Main Flow View ─────────────────────────────────────

export function FlowView({ selectedId, onSelect }: FlowViewProps) {
  const srcXs = aroundPositions(DATA_SOURCES.length); // 5 sources
  const procXs = aroundPositions(PROCESSING_STEPS.length); // 5 processing
  const outXs = aroundPositions(OUTPUTS.length); // 4 outputs

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px] pb-4">
        {/* ── Row 1: External Data Sources ── */}
        <div className="flex justify-around items-start px-4">
          {DATA_SOURCES.map((s) => (
            <FlowNode
              key={s.id}
              id={s.id}
              title={s.name}
              stats={
                s.stats
                  ? Object.entries(s.stats)[0]?.join(": ")
                  : undefined
              }
              description={
                s.signalSubtypes
                  ? `${s.signalSubtypes.length} signal types`
                  : undefined
              }
              color="blue"
              selected={selectedId === s.id}
              onClick={onSelect}
            />
          ))}
        </div>

        {/* ── Connector: sources → supabase ── */}
        <FlowConnector fromXs={srcXs} toXs={[500]} height={70} />
        <FlowLabel text="5 adapters · daily sync 9AM ART" />

        {/* ── Row 2: Knowledge → Supabase ← Stub/Planned ── */}
        <div className="grid grid-cols-[200px_1fr_200px] items-center gap-2 px-4 py-2">
          {/* Left: Knowledge sources */}
          <div className="space-y-2">
            {KNOWLEDGE_SOURCES.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <FlowNode
                  id={s.id}
                  title={s.name}
                  stats={s.stats ? `${s.stats.Entries} entries` : undefined}
                  color="cyan"
                  selected={selectedId === s.id}
                  onClick={onSelect}
                />
                <div className="flex-1 border-t border-dashed border-cyan-500/30 min-w-4" />
              </div>
            ))}
          </div>

          {/* Center: Supabase */}
          <div className="flex justify-center">
            <FlowNode
              id="supabase"
              title="Supabase (PostgreSQL)"
              stats="30+ tables · 1,395 clients"
              description="~1,900 signals · 89 KB entries · 44K similarity pairs"
              color="emerald"
              large
              selected={selectedId === "supabase"}
              onClick={onSelect}
            />
          </div>

          {/* Right: Stub + Planned */}
          <div className="space-y-2">
            {STUB_SOURCES.map((s) => (
              <div key={s.id} className="flex items-center gap-2 justify-end">
                <div className="flex-1 border-t border-dashed border-amber-500/30 min-w-4" />
                <FlowNode
                  id={s.id}
                  title={s.name}
                  stats="Not configured"
                  color="amber"
                  dashed
                  selected={selectedId === s.id}
                  onClick={onSelect}
                />
              </div>
            ))}
            {PLANNED_SOURCES.map((s) => (
              <div key={s.id} className="flex items-center gap-2 justify-end">
                <div className="flex-1 border-t border-dashed border-foreground/10 min-w-4" />
                <FlowNode
                  id={s.id}
                  title={s.name}
                  description={s.description}
                  color="slate"
                  dashed
                  dimmed
                  selected={selectedId === s.id}
                  onClick={onSelect}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Connector: supabase → processing ── */}
        <FlowConnector fromXs={[500]} toXs={procXs} height={70} />
        <FlowLabel text="Intelligence Layer" />

        {/* ── Row 3: Processing ── */}
        <div className="flex justify-around items-start px-4">
          {PROCESSING_STEPS.map((p) => (
            <FlowNode
              key={p.id}
              id={p.id}
              title={p.name}
              stats={p.metric}
              color="blue"
              selected={selectedId === p.id}
              onClick={onSelect}
            />
          ))}
        </div>

        {/* ── Connector: processing → outputs ── */}
        <FlowConnector fromXs={procXs} toXs={outXs} height={70} />
        <FlowLabel text="Delivery" />

        {/* ── Row 4: Outputs ── */}
        <div className="flex justify-around items-start px-4">
          {OUTPUTS.map((o) => (
            <FlowNode
              key={o.id}
              id={o.id}
              title={o.name}
              stats={o.destination}
              color="emerald"
              selected={selectedId === o.id}
              onClick={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
