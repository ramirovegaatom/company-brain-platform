"use client";

import { useState, useEffect, useCallback } from "react";
import type { Client, Signal, Contact, ContextCard, CallSummary } from "@/lib/types";
import { getClient, getClientSignals, getClientContacts, getClientContext, getClientCallSummaries } from "@/lib/api";

interface UseClientDetailResult {
  client: Client | null;
  signals: Signal[];
  contacts: Contact[];
  contextCard: ContextCard | null;
  callSummaries: CallSummary[];
  isLoading: boolean;
  isLoadingContext: boolean;
  isLoadingCalls: boolean;
  contextError: string | null;
  callsError: string | null;
  error: string | null;
  retryContext: () => void;
  loadCallSummaries: () => void;
}

export function useClientDetail(clientId: string): UseClientDetailResult {
  const [client, setClient] = useState<Client | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contextCard, setContextCard] = useState<ContextCard | null>(null);
  const [callSummaries, setCallSummaries] = useState<CallSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [isLoadingCalls, setIsLoadingCalls] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextError, setContextError] = useState<string | null>(null);
  const [callsError, setCallsError] = useState<string | null>(null);
  const [contextRetry, setContextRetry] = useState(0);
  const [callsRequested, setCallsRequested] = useState(false);

  // Fast path: client + signals + contacts in parallel
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    Promise.all([
      getClient(clientId),
      getClientSignals(clientId, { days: 90, limit: 50, signal: controller.signal }),
      getClientContacts(clientId, { signal: controller.signal }),
    ])
      .then(([clientData, signalsData, contactsData]) => {
        if (!cancelled) {
          setClient(clientData);
          setSignals(signalsData.signals);
          setContacts(contactsData.contacts);
        }
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

  const loadCallSummaries = useCallback(() => {
    if (!callsRequested) setCallsRequested(true);
  }, [callsRequested]);

  return {
    client,
    signals,
    contacts,
    contextCard,
    callSummaries,
    isLoading,
    isLoadingContext,
    isLoadingCalls,
    contextError,
    callsError,
    error,
    retryContext: () => setContextRetry((n) => n + 1),
    loadCallSummaries,
  };
}
