"use client";

import { useState, useEffect, useCallback } from "react";
import type { Client, Signal, Contact, ContextCard, CallSummary, HealthBreakdown, SupportSummary, DealsResponse } from "@/lib/types";
import { getClient, getClients, getClientSignals, getClientContacts, getClientContext, getClientCallSummaries, getClientHealth, getClientSupport, getClientDeals } from "@/lib/api";

interface UseClientDetailResult {
  client: Client | null;
  signals: Signal[];
  contacts: Contact[];
  contextCard: ContextCard | null;
  callSummaries: CallSummary[];
  healthBreakdown: HealthBreakdown | null;
  supportData: SupportSummary | null;
  dealsData: DealsResponse | null;
  isLoading: boolean;
  isLoadingContext: boolean;
  isLoadingCalls: boolean;
  isLoadingHealth: boolean;
  isLoadingSupport: boolean;
  isLoadingDeals: boolean;
  contextError: string | null;
  callsError: string | null;
  supportError: string | null;
  dealsError: string | null;
  error: string | null;
  retryContext: () => void;
  loadCallSummaries: () => void;
  loadSupport: () => void;
  loadDeals: () => void;
}

export function useClientDetail(clientId: string): UseClientDetailResult {
  const [client, setClient] = useState<Client | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contextCard, setContextCard] = useState<ContextCard | null>(null);
  const [callSummaries, setCallSummaries] = useState<CallSummary[]>([]);
  const [healthBreakdown, setHealthBreakdown] = useState<HealthBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [isLoadingCalls, setIsLoadingCalls] = useState(false);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextError, setContextError] = useState<string | null>(null);
  const [callsError, setCallsError] = useState<string | null>(null);
  const [supportData, setSupportData] = useState<SupportSummary | null>(null);
  const [isLoadingSupport, setIsLoadingSupport] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [contextRetry, setContextRetry] = useState(0);
  const [callsRequested, setCallsRequested] = useState(false);
  const [supportRequested, setSupportRequested] = useState(false);
  const [dealsData, setDealsData] = useState<DealsResponse | null>(null);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  const [dealsError, setDealsError] = useState<string | null>(null);
  const [dealsRequested, setDealsRequested] = useState(false);

  // Fast path: client + signals + contacts in parallel
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    // Health breakdown in parallel (independent, doesn't block main load)
    setIsLoadingHealth(true);
    getClientHealth(clientId, { signal: controller.signal })
      .then((data) => {
        if (!cancelled) setHealthBreakdown(data);
      })
      .catch(() => {
        // Silently fail — health breakdown is supplementary
      })
      .finally(() => {
        if (!cancelled) setIsLoadingHealth(false);
      });

    Promise.all([
      getClient(clientId),
      getClientSignals(clientId, { days: 90, limit: 50, signal: controller.signal }),
      getClientContacts(clientId, { signal: controller.signal }),
    ])
      .then(async ([clientData, signalsData, contactsData]) => {
        if (cancelled) return;

        // Merge metadata from all variants of this client (BQ + Vitally + manual)
        try {
          const variants = await getClients({ search: clientData.name, limit: 10 });
          const sameNameClients = variants.clients.filter(
            (c) => c.name.trim().toUpperCase() === clientData.name.trim().toUpperCase()
          );
          if (sameNameClients.length > 1) {
            const mergedMeta: Record<string, unknown> = {};
            // Apply all variants, primary client wins on conflicts
            for (const variant of sameNameClients) {
              if (variant.id === clientData.id) continue;
              for (const [key, value] of Object.entries(variant.metadata || {})) {
                if (value !== null && value !== undefined && value !== 0 && value !== "") {
                  mergedMeta[key] = value;
                }
              }
            }
            // Primary client's metadata overwrites
            for (const [key, value] of Object.entries(clientData.metadata || {})) {
              if (value !== null && value !== undefined && value !== 0 && value !== "") {
                mergedMeta[key] = value;
              }
            }
            clientData = { ...clientData, metadata: mergedMeta };
          }
        } catch {
          // Silently fail — use single client metadata
        }

        setClient(clientData);
        setSignals(signalsData.signals);
        setContacts(contactsData.contacts);
      })
      .catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clientId]);

  // Slow path: context card (5-25s)
  useEffect(() => {
    let cancelled = false;
    setIsLoadingContext(true);
    setContextError(null);
    setContextCard(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    getClientContext(clientId)
      .then((card) => {
        if (!cancelled) setContextCard(card);
      })
      .catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          setContextError(err.message);
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setIsLoadingContext(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [clientId, contextRetry]);

  // Lazy path: call summaries (loaded on demand when Calls tab is opened)
  useEffect(() => {
    if (!callsRequested) return;

    let cancelled = false;
    setIsLoadingCalls(true);
    setCallsError(null);

    const controller = new AbortController();

    getClientCallSummaries(clientId, { days: 90, limit: 20, signal: controller.signal })
      .then((data) => {
        if (!cancelled) setCallSummaries(data.summaries);
      })
      .catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          setCallsError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCalls(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clientId, callsRequested]);

  // Lazy path: support conversations (loaded on demand when Support tab is opened)
  useEffect(() => {
    if (!supportRequested) return;

    let cancelled = false;
    setIsLoadingSupport(true);
    setSupportError(null);

    const controller = new AbortController();

    getClientSupport(clientId, { days: 90, limit: 30, signal: controller.signal })
      .then((data) => {
        if (!cancelled) setSupportData(data);
      })
      .catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          setSupportError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSupport(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clientId, supportRequested]);

  // Lazy path: deals (loaded on demand when Deals tab is opened)
  useEffect(() => {
    if (!dealsRequested) return;

    let cancelled = false;
    setIsLoadingDeals(true);
    setDealsError(null);

    const controller = new AbortController();

    getClientDeals(clientId, { signal: controller.signal })
      .then((data) => {
        if (!cancelled) setDealsData(data);
      })
      .catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          setDealsError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingDeals(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clientId, dealsRequested]);

  const loadCallSummaries = useCallback(() => {
    if (!callsRequested) setCallsRequested(true);
  }, [callsRequested]);

  const loadSupport = useCallback(() => {
    if (!supportRequested) setSupportRequested(true);
  }, [supportRequested]);

  const loadDeals = useCallback(() => {
    if (!dealsRequested) setDealsRequested(true);
  }, [dealsRequested]);

  return {
    client,
    signals,
    contacts,
    contextCard,
    callSummaries,
    healthBreakdown,
    supportData,
    dealsData,
    isLoading,
    isLoadingContext,
    isLoadingCalls,
    isLoadingHealth,
    isLoadingSupport,
    isLoadingDeals,
    contextError,
    callsError,
    supportError,
    dealsError,
    error,
    retryContext: () => setContextRetry((n) => n + 1),
    loadCallSummaries,
    loadSupport,
    loadDeals,
  };
}
