"use client";

// Shared flow visualization components used by both the general Data Map
// and the per-account Data Map.

// ── SVG Connector ──────────────────────────────────────

export function FlowConnector({
  fromXs,
  toXs,
  height = 80,
  color = "text-emerald-500/25",
}: {
  fromXs: number[];
  toXs: number[];
  height?: number;
  color?: string;
}) {
  const paths: string[] = [];

  if (toXs.length === 1) {
    const cx = toXs[0];
    for (const x of fromXs) {
      if (x === cx) {
        paths.push(`M${x},0 L${x},${height}`);
      } else {
        paths.push(`M${x},0 Q${x},${height * 0.55} ${cx},${height}`);
      }
    }
  } else if (fromXs.length === 1) {
    const cx = fromXs[0];
    for (const x of toXs) {
      if (x === cx) {
        paths.push(`M${x},0 L${x},${height}`);
      } else {
        paths.push(`M${cx},0 Q${cx},${height * 0.45} ${x},${height}`);
      }
    }
  } else {
    const mid = height / 2;
    for (const x of fromXs) {
      paths.push(`M${x},0 Q${x},${mid * 0.6} 500,${mid}`);
    }
    for (const x of toXs) {
      paths.push(`M500,${mid} Q500,${mid + mid * 0.4} ${x},${height}`);
    }
  }

  return (
    <svg
      className={`w-full ${color}`}
      style={{ height: `${height}px` }}
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

// ── Flow Label ─────────────────────────────────────────

export function FlowLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-1.5">
      <span className="h-px w-12 bg-muted-foreground/20" />
      <span className="text-[11px] text-muted-foreground/70 italic whitespace-nowrap">
        {text}
      </span>
      <span className="h-px w-12 bg-muted-foreground/20" />
    </div>
  );
}

// ── Position helpers ───────────────────────────────────

export function aroundPositions(n: number): number[] {
  return Array.from({ length: n }, (_, i) => ((i + 0.5) / n) * 1000);
}
