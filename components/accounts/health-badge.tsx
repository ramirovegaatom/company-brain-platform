"use client";

import { cn } from "@/lib/utils";
import { getHealthBgColor, getHealthLabel } from "@/lib/health-utils";

interface HealthBadgeProps {
  score: number | null;
  size?: "sm" | "default";
}

export function HealthBadge({ score, size = "default" }: HealthBadgeProps) {
  const colorClass = getHealthBgColor(score);
  const label = getHealthLabel(score);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        colorClass,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      )}
    >
      {score !== null && (
        <span className="font-semibold">{score}</span>
      )}
      <span className={score !== null ? "opacity-75" : ""}>{label}</span>
    </span>
  );
}
