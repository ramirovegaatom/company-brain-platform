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

/** Merge duplicate clients (same name, different sources). Keeps the richest entry. */
function deduplicateClients(clients: Client[]): Client[] {
  const byName = new Map<string, Client>();

  for (const c of clients) {
    const key = c.name.trim().toUpperCase();
    const existing = byName.get(key);

    if (!existing) {
      byName.set(key, c);
      continue;
    }

    // Score: prefer higher MRR, then higher health, then more metadata
    const existingScore = (existing.mrr || 0) * 1000 + (existing.health_score || 0) * 10 +
      Object.keys(existing.metadata || {}).length;
    const newScore = (c.mrr || 0) * 1000 + (c.health_score || 0) * 10 +
      Object.keys(c.metadata || {}).length;

    if (newScore > existingScore) {
      byName.set(key, c);
    }
  }

  return Array.from(byName.values());
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
