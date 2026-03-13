"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SourceNode } from "@/lib/architecture-data";

interface SourceNodeCardProps {
  node: SourceNode;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function SourceNodeCard({ node, selected, onSelect }: SourceNodeCardProps) {
  const Icon = node.icon;

  return (
    <button
      onClick={() => onSelect(node.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all",
        "ring-1 bg-card",
        node.status === "active" && "ring-emerald-500/30 hover:ring-emerald-500/50",
        node.status === "stub" && "ring-amber-500/30 hover:ring-amber-500/50",
        node.status === "planned" && "ring-foreground/10 opacity-60 border-dashed hover:opacity-80",
        selected && node.status === "active" && "ring-2 ring-emerald-500",
        selected && node.status === "stub" && "ring-2 ring-amber-500",
        selected && node.status === "planned" && "ring-2 ring-foreground/30 opacity-100"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
          node.status === "active" && "bg-emerald-500/10 text-emerald-400",
          node.status === "stub" && "bg-amber-500/10 text-amber-400",
          node.status === "planned" && "bg-foreground/5 text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{node.name}</span>
          <StatusBadge status={node.status} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {node.description}
        </p>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: SourceNode["status"] }) {
  if (status === "active") return null;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] h-4 px-1.5",
        status === "stub" && "border-amber-500/40 text-amber-400",
        status === "planned" && "border-foreground/20 text-muted-foreground"
      )}
    >
      {status === "stub" ? "Stub" : "Planned"}
    </Badge>
  );
}
