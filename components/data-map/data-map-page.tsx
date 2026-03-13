"use client";

import { useState } from "react";
import {
  DATA_SOURCES,
  KNOWLEDGE_SOURCES,
  STUB_SOURCES,
  PLANNED_SOURCES,
  PROCESSING_STEPS,
  OUTPUTS,
} from "@/lib/architecture-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SourceNodeCard } from "./source-node";
import { ProcessingNodeCard } from "./processing-node";
import { OutputNodeCard } from "./output-node";
import { SourceDetailPanel } from "./source-detail-panel";
import { PipelineLegend } from "./pipeline-legend";
import { ConnectionChevron } from "./connection-lines";
import { FlowView } from "./flow-view";

export function DataMapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-6 p-6">
      {/* Legend + stats */}
      <PipelineLegend />

      {/* View tabs */}
      <Tabs defaultValue="flow">
        <TabsList>
          <TabsTrigger value="flow">Flow</TabsTrigger>
          <TabsTrigger value="grid">Grid</TabsTrigger>
        </TabsList>

        {/* ── Flow View ── */}
        <TabsContent value="flow">
          <FlowView selectedId={selectedId} onSelect={handleSelect} />
        </TabsContent>

        {/* ── Grid View ── */}
        <TabsContent value="grid">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-start">
            {/* Column 1: Data Sources */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">
                Data Sources
              </h3>
              <div className="space-y-2">
                {DATA_SOURCES.map((node) => (
                  <SourceNodeCard
                    key={node.id}
                    node={node}
                    selected={selectedId === node.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                  Knowledge Base
                </h4>
                {KNOWLEDGE_SOURCES.map((node) => (
                  <SourceNodeCard
                    key={node.id}
                    node={node}
                    selected={selectedId === node.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                  Not Configured
                </h4>
                {STUB_SOURCES.map((node) => (
                  <SourceNodeCard
                    key={node.id}
                    node={node}
                    selected={selectedId === node.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                  Planned
                </h4>
                {PLANNED_SOURCES.map((node) => (
                  <SourceNodeCard
                    key={node.id}
                    node={node}
                    selected={selectedId === node.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>

            <ConnectionChevron />

            {/* Column 2: Ingestion */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">
                Ingestion
              </h3>
              <div className="rounded-xl ring-1 ring-foreground/10 bg-card p-4 space-y-3">
                {[
                  { label: "Sync Clients", desc: "Create/update client records" },
                  { label: "Sync Contacts", desc: "Create/update contact records" },
                  { label: "Generate Signals", desc: "Detect and score events" },
                  { label: "KB Ingestion", desc: "Embed knowledge base entries" },
                ].map((step) => (
                  <div key={step.label}>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <ConnectionChevron />

            {/* Column 3: Intelligence */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">
                Intelligence
              </h3>
              {PROCESSING_STEPS.map((node) => (
                <ProcessingNodeCard
                  key={node.id}
                  node={node}
                  selected={selectedId === node.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            <ConnectionChevron />

            {/* Column 4: Outputs */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">
                Outputs
              </h3>
              {OUTPUTS.map((node) => (
                <OutputNodeCard
                  key={node.id}
                  node={node}
                  selected={selectedId === node.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail panel */}
      <SourceDetailPanel selectedId={selectedId} />
    </div>
  );
}
