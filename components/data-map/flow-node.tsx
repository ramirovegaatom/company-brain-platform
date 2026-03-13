"use client";

import { cn } from "@/lib/utils";

type FlowNodeColor = "blue" | "emerald" | "cyan" | "purple" | "amber" | "slate";

interface FlowNodeProps {
  id: string;
  title: string;
  stats?: string;
  description?: string;
  color: FlowNodeColor;
  dashed?: boolean;
  dimmed?: boolean;
  large?: boolean;
  selected?: boolean;
  onClick?: (id: string) => void;
}

const borderColors: Record<FlowNodeColor, string> = {
  blue: "border-blue-500/60",
  emerald: "border-emerald-500/60",
  cyan: "border-cyan-500/60",
  purple: "border-purple-500/60",
  amber: "border-amber-500/60",
  slate: "border-foreground/20",
};

const titleColors: Record<FlowNodeColor, string> = {
  blue: "text-blue-400",
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
  slate: "text-muted-foreground",
};

const ringColors: Record<FlowNodeColor, string> = {
  blue: "ring-blue-500",
  emerald: "ring-emerald-500",
  cyan: "ring-cyan-500",
  purple: "ring-purple-500",
  amber: "ring-amber-500",
  slate: "ring-foreground/40",
};

export function FlowNode({
  id,
  title,
  stats,
  description,
  color,
  dashed = false,
  dimmed = false,
  large = false,
  selected = false,
  onClick,
}: FlowNodeProps) {
  return (
    <button
      onClick={() => onClick?.(id)}
      className={cn(
        "rounded-lg border-2 text-center transition-all cursor-pointer bg-card/80 backdrop-blur-sm",
        large ? "px-6 py-4 min-w-[220px]" : "px-3 py-2.5 min-w-[130px] max-w-[170px]",
        borderColors[color],
        dashed && "border-dashed",
        dimmed && "opacity-50 hover:opacity-70",
        !dimmed && "hover:brightness-110",
        selected && `ring-2 ${ringColors[color]} ring-offset-1 ring-offset-background`
      )}
    >
      <div className={cn(
        "font-semibold truncate",
        large ? "text-base" : "text-xs",
        titleColors[color]
      )}>
        {title}
      </div>
      {stats && (
        <div className={cn(
          "text-muted-foreground mt-0.5",
          large ? "text-xs" : "text-[10px]"
        )}>
          {stats}
        </div>
      )}
      {description && (
        <div className={cn(
          "text-muted-foreground/60 mt-0.5",
          large ? "text-xs" : "text-[10px]"
        )}>
          {description}
        </div>
      )}
    </button>
  );
}
