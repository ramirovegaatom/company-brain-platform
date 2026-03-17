// Safe extraction helpers for client.metadata (Record<string, unknown>)
// Avoids type-casting everywhere and handles nulls/undefined gracefully.

type Metadata = Record<string, unknown>;

export function getNum(meta: Metadata, key: string): number | null {
  const v = meta[key];
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

export function getPct(meta: Metadata, key: string): number | null {
  const v = getNum(meta, key);
  if (v === null) return null;
  // If value is already 0-1 (ratio), return as-is. If > 1, assume already percentage.
  return v;
}

export function getStr(meta: Metadata, key: string): string | null {
  const v = meta[key];
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}

export function getList(meta: Metadata, key: string): string[] {
  const v = meta[key];
  if (!Array.isArray(v)) return [];
  return v.map(String);
}

export function getObjList(meta: Metadata, key: string): Record<string, unknown>[] {
  const v = meta[key];
  if (!Array.isArray(v)) return [];
  return v as Record<string, unknown>[];
}

export function formatPercent(value: number | null): string {
  if (value === null) return "—";
  // If value is between 0-1, treat as ratio
  if (value >= 0 && value <= 1) return `${(value * 100).toFixed(0)}%`;
  // Otherwise treat as already a percentage
  return `${value.toFixed(0)}%`;
}

export function formatNumber(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatMoney(value: number | null): string {
  if (value === null) return "—";
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
