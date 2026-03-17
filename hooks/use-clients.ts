"use client";

import { useState, useEffect, useMemo } from "react";
import type { Client, HealthRange, SortField, SortDirection } from "@/lib/types";
import { getAllClients } from "@/lib/api";
import { scoreInRange } from "@/lib/health-utils";

interface UseClientsParams {
  search: string;
  lifecycleStage: string;
  healthRange: HealthRange;
  sortField: SortField;
  sortDirection: SortDirection;
}

interface UseClientsResult {
  clients: Client[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

/** Merge duplicate clients (same name, different sources).
 * Keeps the entry with highest MRR as base, but merges metadata from ALL entries.
 * This ensures BQ fields (conversaciones_contratadas) combine with Vitally fields (conversaciones_actuales). */
function deduplicateClients(clients: Client[]): Client[] {
  const byName = new Map<string, Client[]>();

  // Group by name
  for (const c of clients) {
    const key = c.name.trim().toUpperCase();
    const group = byName.get(key) || [];
    group.push(c);
    byName.set(key, group);
  }

  // Merge each group
  return Array.from(byName.values()).map((group) => {
    if (group.length === 1) return group[0];

    // Sort by richness: highest MRR > more metadata > higher health
    group.sort((a, b) => {
      const aScore = (a.mrr || 0) * 1000 + Object.keys(a.metadata || {}).length * 10 + (a.health_score || 0);
      const bScore = (b.mrr || 0) * 1000 + Object.keys(b.metadata || {}).length * 10 + (b.health_score || 0);
      return bScore - aScore;
    });

    // Base = richest entry
    const base = { ...group[0] };

    // Merge metadata from all entries (base wins on conflicts)
    const mergedMeta: Record<string, unknown> = {};
    // Apply in reverse order so richest entry's values win
    for (let i = group.length - 1; i >= 0; i--) {
      const meta = group[i].metadata || {};
      for (const [key, value] of Object.entries(meta)) {
        if (value !== null && value !== undefined && value !== 0 && value !== "") {
          mergedMeta[key] = value;
        }
      }
    }
    base.metadata = mergedMeta;

    return base;
  });
}

export function useClients(params: UseClientsParams): UseClientsResult {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getAllClients()
      .then((res) => {
        if (!cancelled) {
          // Deduplicate by name — keep the entry with richest data (highest MRR, then health)
          const deduped = deduplicateClients(res.clients);
          setAllClients(deduped);
          setTotal(deduped.length);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const { search, lifecycleStage, healthRange, sortField, sortDirection } = params;
    const query = search.toLowerCase().trim();

    let result = allClients.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query)) return false;
      if (lifecycleStage !== "all" && c.lifecycle_stage !== lifecycleStage) return false;
      if (!scoreInRange(c.health_score, healthRange)) return false;
      return true;
    });

    result.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;

      if (sortField === "name") {
        return dir * a.name.localeCompare(b.name);
      }

      const aVal = sortField === "health_score" ? a.health_score : a.mrr;
      const bVal = sortField === "health_score" ? b.health_score : b.mrr;

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      return dir * (aVal - bVal);
    });

    return result;
  }, [allClients, params]);

  return {
    clients: filtered,
    total: isLoading ? 0 : total,
    isLoading,
    error,
  };
}
