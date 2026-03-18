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

// Chat types
export interface ChatClientSummary {
  id: string;
  name: string;
  industry: string | null;
  lifecycle_stage: string | null;
  health_score: number | null;
  mrr: number | null;
}

export interface ChatQueryRequest {
  question: string;
  conversation_history: { role: "user" | "assistant"; content: string }[];
  client_id: string | null;
}

export type ChatResponseType = "context_card" | "client_list" | "text" | "help";

export interface ChatQueryResponse {
  response_type: ChatResponseType;
  context_card: ContextCard | null;
  client: ChatClientSummary | null;
  clients: ChatClientSummary[] | null;
  summary: string | null;
  answer: string | null;
  sources: string[];
  resolved_intent: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: ChatQueryResponse;
  isLoading?: boolean;
}

// Call Summaries
export interface CallSummary {
  call_id: string;
  call_date: string;
  duration_seconds: number | null;
  ai_score: number | null;
  summary: string;
  topics: string[];
  detected_themes: Record<string, unknown>;
  participants_internal: string[];
  participants_external: string[];
}

export interface CallSummariesResponse {
  summaries: CallSummary[];
  total: number;
}

// Intercom Support
export interface IntercomConversation {
  id: string;
  conversation_id: string;
  client_id: string;
  state: string;
  subject: string | null;
  body: string | null;
  category: string | null;
  module: string | null;
  issue_type: string | null;
  sentiment: string | null;
  churn_alert: boolean;
  churn_reason: string | null;
  solution: string | null;
  ai_participated: boolean;
  resolution_state: string | null;
  priority: string | null;
  tags: string[];
  csat_rating: number | null;
  csat_remark: string | null;
  time_to_first_reply_sec: number | null;
  time_to_resolution_sec: number | null;
  count_reopens: number;
  count_parts: number;
  assignee_name: string | null;
  team_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  conversation_url: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface SupportSummary {
  conversations: IntercomConversation[];
  total: number;
  open: number;
  avg_resolution_sec: number | null;
  avg_csat: number | null;
  sentiment_distribution: Record<string, number>;
  top_modules: [string, number][];
}

// Health Breakdown
export interface HealthCategory {
  category: string;
  score: number;
  weight: number;
  weighted_score: number;
}

export interface HealthFactor {
  signal: string;
  impact: number;
}

export interface HealthBreakdown {
  score: number;
  trend: HealthTrend;
  categories: HealthCategory[];
  top_risk_factors: HealthFactor[];
  top_positive_factors: HealthFactor[];
}

// CRM Deals
export interface Deal {
  id: string;
  client_id: string;
  deal_name: string;
  stage: string | null;
  value: number | null;
  currency: string;
  owner: string | null;
  assigned_bdr: string | null;
  close_date: string | null;
  source_system: string | null;
  record_id: string | null;
  spiced_data: Record<string, string>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DealsResponse {
  deals: Deal[];
  total: number;
  active: number;
  total_pipeline_value: number;
}

// Dashboard types
export interface HealthBucket {
  label: string;
  min_score: number;
  max_score: number;
  count: number;
  mrr: number;
}

export interface LifecycleBucket {
  stage: string;
  count: number;
  avg_health: number | null;
  mrr: number;
}

export interface SignalWeekBucket {
  week: string;
  positive: number;
  negative: number;
  net_score: number;
}

export interface PatternHeatmapEntry {
  pattern_name: string;
  pattern_type: string;
  count: number;
  avg_confidence: number;
  top_clients: { id: string; name: string }[];
}

export interface TopRiskSignal {
  subtype: string;
  score: number;
  description: string | null;
}

export interface TopRiskClient {
  id: string;
  name: string;
  health_score: number | null;
  mrr: number | null;
  lifecycle_stage: string | null;
  patterns: string[];
  top_signals: TopRiskSignal[];
}

export interface DashboardSummary {
  total_clients: number;
  total_mrr: number;
  mrr_at_risk: number;
  count_critical: number;
  count_at_risk: number;
  count_stable: number;
  count_healthy: number;
  health_distribution: HealthBucket[];
  lifecycle_distribution: LifecycleBucket[];
  signal_trends: SignalWeekBucket[];
  pattern_heatmap: PatternHeatmapEntry[];
  top_risks: TopRiskClient[];
  generated_at: string;
}
