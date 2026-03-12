import type { Client, ClientListResponse, ContextCard, SignalsResponse, ContactsResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function getClients(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<ClientListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  if (params?.search) searchParams.set("search", params.search);
  const qs = searchParams.toString();
  return fetchApi(`/api/v1/clients${qs ? `?${qs}` : ""}`);
}

export function getClient(id: string): Promise<Client> {
  return fetchApi(`/api/v1/clients/${id}`);
}

export function getClientContext(id: string): Promise<ContextCard> {
  return fetchApi(`/api/v1/clients/${id}/context`);
}

export function getTopRisks(limit = 10): Promise<Client[]> {
  return fetchApi(`/api/v1/intelligence/top-risks?limit=${limit}`);
}

export function getAllClients(): Promise<ClientListResponse> {
  return getClients({ limit: 2000 });
}

export function getClientSignals(
  id: string,
  options?: { days?: number; limit?: number; signal?: AbortSignal }
): Promise<SignalsResponse> {
  const params = new URLSearchParams();
  if (options?.days) params.set("days", String(options.days));
  if (options?.limit) params.set("limit", String(options.limit));
  const qs = params.toString();
  return fetchApi(`/api/v1/clients/${id}/signals${qs ? `?${qs}` : ""}`, {
    signal: options?.signal,
  });
}

export function getClientContacts(
  id: string,
  options?: { signal?: AbortSignal }
): Promise<ContactsResponse> {
  return fetchApi(`/api/v1/clients/${id}/contacts`, {
    signal: options?.signal,
  });
}
