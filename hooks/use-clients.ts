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
          setAllClients(res.clients);
          setTotal(res.total);
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
