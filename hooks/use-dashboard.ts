"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardSummary } from "@/lib/types";
import { getDashboardSummary } from "@/lib/api";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface UseDashboardResult {
  data: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    getDashboardSummary()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, error, refresh: fetchData };
}
