"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DATA_SOURCES,
  KNOWLEDGE_SOURCES,
  STUB_SOURCES,
  PLANNED_SOURCES,
  CENTRAL_DATABASE,
  PROCESSING_STEPS,
  OUTPUTS,
} from "@/lib/architecture-data";
import type { SourceNode, ProcessingNode, OutputNode } from "@/lib/architecture-data";

interface DetailPanelProps {
  selectedId: string | null;
}

type AnyNode = SourceNode | ProcessingNode | OutputNode;

function findNode(id: string): { node: AnyNode; type: "source" | "processing" | "output" } | null {
  const allSources = [...DATA_SOURCES, ...KNOWLEDGE_SOURCES, ...STUB_SOURCES, ...PLANNED_SOURCES, CENTRAL_DATABASE];
  const source = allSources.find((n) => n.id === id);
  if (source) return { node: source, type: "source" };

  const proc = PROCESSING_STEPS.find((n) => n.id === id);
  if (proc) return { node: proc, type: "processing" };

  const output = OUTPUTS.find((n) => n.id === id);
  if (output) return { node: output, type: "output" };

  return null;
}

export function SourceDetailPanel({ selectedId }: DetailPanelProps) {
  if (!selectedId) return null;

  const found = findNode(selectedId);
  if (!found) return null;

  const { node, type } = found;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <node.icon className="size-5" />
          {node.name}
          {type === "source" && (
            <StatusBadgeInline status={(node as SourceNode).status} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{node.description}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Capabilities */}
          {type === "source" && (node as SourceNode).capabilities && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Capabilities
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(node as SourceNode).capabilities!.map((cap) => (
                  <Badge key={cap} variant="secondary" className="text-[10px]">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {type === "source" && (node as SourceNode).stats && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Stats
              </h4>
              <dl className="space-y-1">
                {Object.entries((node as SourceNode).stats!).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="font-mono">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Signal Subtypes */}
          {type === "source" && (node as SourceNode).signalSubtypes && (
            <div className="md:col-span-2 lg:col-span-1">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Signal Subtypes ({(node as SourceNode).signalSubtypes!.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(node as SourceNode).signalSubtypes!.map((sig) => (
                  <Badge
                    key={sig.name}
                    variant="outline"
                    className={`text-[10px] ${
                      sig.score > 0
                        ? "border-emerald-500/30 text-emerald-400"
                        : "border-red-500/30 text-red-400"
                    }`}
                  >
                    {sig.name} ({sig.score > 0 ? "+" : ""}
                    {sig.score})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Processing details */}
          {type === "processing" && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Metric
              </h4>
              <span className="text-sm font-mono text-blue-400">
                {(node as ProcessingNode).metric}
              </span>
            </div>
          )}

          {/* Output details */}
          {type === "output" && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Destination
              </h4>
              <span className="text-sm">{(node as OutputNode).destination}</span>
            </div>
          )}

          {/* Details (all types) */}
          {"details" in node && node.details && (
            <div className={type === "source" ? "md:col-span-2 lg:col-span-3" : "md:col-span-2"}>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Details
              </h4>
              <ul className="space-y-1">
                {node.details.map((d, i) => (
                  <li key={i} className="text-xs text-muted-foreground font-mono">
                    • {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadgeInline({ status }: { status: SourceNode["status"] }) {
  if (status === "active") {
    return (
      <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400">
        Active
      </Badge>
    );
  }
  if (status === "stub") {
    return (
      <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400">
        Stub
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px] border-foreground/20 text-muted-foreground">
      Planned
    </Badge>
  );
}
