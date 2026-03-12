export function getHealthColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-blue-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

export function getHealthBgColor(score: number | null): string {
  if (score === null) return "bg-muted text-muted-foreground";
  if (score >= 80) return "bg-emerald-400/15 text-emerald-400";
  if (score >= 60) return "bg-blue-400/15 text-blue-400";
  if (score >= 40) return "bg-amber-400/15 text-amber-400";
  return "bg-red-400/15 text-red-400";
}

export function getHealthLabel(score: number | null): string {
  if (score === null) return "N/A";
  if (score >= 80) return "Healthy";
  if (score >= 60) return "Stable";
  if (score >= 40) return "At Risk";
  return "Critical";
}

export function formatMRR(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function getLifecycleColor(stage: string | null): string {
  switch (stage) {
    case "onboarding":
      return "bg-purple-400/15 text-purple-400";
    case "growing":
      return "bg-emerald-400/15 text-emerald-400";
    case "mature":
    case "active":
      return "bg-blue-400/15 text-blue-400";
    case "at_risk":
      return "bg-amber-400/15 text-amber-400";
    case "churning":
      return "bg-red-400/15 text-red-400";
    case "churned":
      return "bg-red-400/10 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function formatLifecycleLabel(stage: string | null): string {
  if (!stage) return "Unknown";
  return stage
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function scoreInRange(
  score: number | null,
  range: string
): boolean {
  if (range === "all") return true;
  if (score === null) return false;
  switch (range) {
    case "healthy":
      return score >= 80;
    case "stable":
      return score >= 60 && score < 80;
    case "at_risk":
      return score >= 40 && score < 60;
    case "critical":
      return score < 40;
    default:
      return true;
  }
}
