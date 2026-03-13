"use client";

import { cn } from "@/lib/utils";
import type { OutputNode } from "@/lib/architecture-data";

interface OutputNodeCardProps {
  node: OutputNode;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function OutputNodeCard({ node, selected, onSelect }: OutputNodeCardProps) {
  const Icon = node.icon;

  return (
    <button
      onClick={() => onSelect(node.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all",
        "ring-1 ring-purple-500/20 bg-card hover:ring-purple-500/40",
        selected && "ring-2 ring-purple-500"
      )}
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium">{node.name}</span>
        <p className="mt-0.5 text-xs text-muted-foreground">{node.description}</p>
        <span className="mt-1 inline-block text-xs text-purple-400/70">
          → {node.destination}
        </span>
      </div>
    </button>
  );
}
