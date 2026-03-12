"use client";

import { useState, useEffect } from "react";
import type { Client, Signal, Contact, ContextCard } from "@/lib/types";
import { getClient, getClientSignals, getClientContacts, getClientContext } from "@/lib/api";

interface UseClientDetailResult {
  client: Client | null;
  signals: Signal[];
  contacts: Contact[];
  contextCard: ContextCard | null;
  isLoading: boolean;
  isLoadingContext: boolean;
  contextError: string | null;
  error: string | null;
  retryContext: () => void;
}

export function useClientDetail(clientId: string): UseClientDetailResult {
  const [client, setClient] = useState<Client | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contextCard, setContextCard] = useState<ContextCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextError, setContextError] = useState<string | null>(null);
  const [contextRetry, setContextRetry] = useState(0);

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

  return {
    client,
    signals,
    contacts,
    contextCard,
    isLoading,
    isLoadingContext,
    contextError,
    error,
    retryContext: () => setContextRetry((n) => n + 1),
  };
}
