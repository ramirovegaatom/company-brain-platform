// Mirrors Python models from company-brain backend

export type ClientSize = "startup" | "smb" | "mid_market" | "enterprise" | "unknown";
export type LifecycleStage = "onboarding" | "growing" | "mature" | "active" | "at_risk" | "churning" | "churned" | "unknown";
export type HealthTrend = "improving" | "stable" | "declining";
export type SignalType = "usage_change" | "engagement_change" | "company_event" | "product_event" | "risk_indicator";
export type PatternType = "churn_risk" | "expansion_signal" | "success_indicator" | "stall_pattern";

export interface Client {
  id: string;
  name: string;
  industry: string | null;
  size: ClientSize | null;
  plan: string | null;
  mrr: number | null;
  contract_start: string | null;
  contract_end: string | null;
  lifecycle_stage: LifecycleStage | null;
  health_score: number | null;
  icp_fit_score: number | null;
  source: string | null;
  source_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ClientListResponse {
  clients: Client[];
  total: number;
}

export interface SignalSummary {
  type: string;
  description: string;
  score_impact: number;
}

export interface PatternMatchSummary {
  pattern_name: string;
  description: string;
  confidence: number;
  similar_clients: string[];
}

export interface RecommendedAction {
  action: string;
  reasoning: string;
  playbook: string | null;
  talking_points: string[];
}

export interface ContextCard {
  client_id: string;
  client_name: string;
  health_score: number;
  health_trend: HealthTrend;
  signals: SignalSummary[];
  pattern_matches: PatternMatchSummary[];
  recommended_action: RecommendedAction | null;
  generated_at: string;
  justification: string;
}

// Signals endpoint
export interface Signal {
  id: string;
  client_id: string;
  type: string;
  subtype: string;
  score: number;
  detected_at: string;
  source: string;
  description: string | null;
  is_acknowledged: boolean;
  metadata: Record<string, unknown>;
}

export interface SignalsResponse {
  signals: Signal[];
  total: number;
}

// Contacts endpoint
export interface Contact {
  id: string;
  client_id: string;
  name: string;
  email: string | null;
  role: string | null;
  decision_power: string | null;
  is_champion: boolean;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
}

// Filter types
export type HealthRange = "all" | "healthy" | "stable" | "at_risk" | "critical";
export type SortField = "name" | "health_score" | "mrr";
export type SortDirection = "asc" | "desc";
