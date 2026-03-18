// Architecture data for the Data Map visualization
// Edit this file when adapters/sources change (~1x/month)

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Database,
  Cpu,
  Phone,
  MessageCircle,
  BookOpen,
  FileCode,
  Link2,
  ListChecks,
  Globe,
  Bot,
  BarChart3,
  MessageSquare,
  CreditCard,
  Zap,
  Brain,
  GitCompare,
  Layers,
  Search,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────

export type NodeStatus = "active" | "stub" | "planned";
export type ColumnType = "source" | "ingestion" | "processing" | "output";

export interface SignalSubtype {
  name: string;
  score: number;
  description?: string;
}

export interface SourceNode {
  id: string;
  name: string;
  icon: LucideIcon;
  status: NodeStatus;
  description: string;
  category: "adapter" | "knowledge";
  capabilities?: string[];
  signalSubtypes?: SignalSubtype[];
  stats?: Record<string, string | number>;
  details?: string[];
}

export interface ProcessingNode {
  id: string;
  name: string;
  icon: LucideIcon;
  metric: string;
  description: string;
  details?: string[];
}

export interface OutputNode {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  destination: string;
}

// ── Data Sources ───────────────────────────────────────

export const DATA_SOURCES: SourceNode[] = [
  {
    id: "atom-hub",
    name: "Atom Hub",
    icon: Database,
    status: "active",
    description: "Unified BQ source — daily snapshots, campaigns, conversations, CSM finance",
    category: "adapter",
    capabilities: ["SYNC_CLIENTS", "GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "abandonment_increase", score: -8 },
      { name: "abandonment_decrease", score: 5 },
      { name: "user_churn", score: -5 },
      { name: "user_growth", score: 4 },
      { name: "response_time_degradation", score: -3 },
      { name: "high_consumption", score: 5 },
      { name: "low_consumption", score: -6 },
      { name: "consumption_below_pace", score: -6 },
      { name: "consumption_over_pace", score: 5 },
      { name: "consumption_3m_declining", score: -4 },
      { name: "zero_outbound_usage", score: -4 },
      { name: "zero_ai_usage", score: -3 },
      { name: "zero_bot_usage", score: -3 },
      { name: "ai_usage_drop", score: -5 },
      { name: "outbound_usage_drop", score: -4 },
      { name: "conversation_volume_drop", score: -5 },
      { name: "conversation_volume_spike", score: 3 },
      { name: "low_funnel_progression", score: -4 },
      { name: "overdue_invoices", score: -6 },
      { name: "high_overdue_amount", score: -8 },
      { name: "excess_revenue_opportunity", score: 3 },
    ],
    stats: {
      "BQ project": "atom-ai-hub",
      "Tables": "atom.companies_insights, atom.companies_outbound_analysis, atom.conversation_message_history, vitally_csm.vitally_bigquery",
      "Replaces": "BigQuery + Adoption + Labs + Conv Logs",
      "Snapshots": "Daily (was weekly)",
    },
    details: [
      "atom.companies_insights — daily operational snapshots per company",
      "atom.companies_outbound_analysis — campaign-level data with template text",
      "atom.conversation_message_history — per-lead conversations (last 30d)",
      "vitally_csm.vitally_bigquery — MRR, finance, churn reasons, team assignments",
      "42 signal subtypes covering usage, adoption, conversations, and finance",
    ],
  },
  {
    id: "crm-hub",
    name: "CRM Hub",
    icon: Globe,
    status: "active",
    description: "CRM data from Attio + HubSpot — deals, contacts, ICP, team assignments",
    category: "adapter",
    capabilities: ["SYNC_CONTACTS", "GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "deal_stalled", score: -4 },
      { name: "deal_near_close", score: 5 },
      { name: "no_active_deals", score: -2 },
      { name: "champion_identified", score: 3 },
    ],
    stats: {
      "BQ project": "atom-ai-hub",
      "Tables": "crm.companies, crm.deals, crm.people",
    },
    details: [
      "crm.companies — ICP tier, outbound stage, partners, assigned CSM/AE/BDR",
      "crm.deals — pipeline with stage, value, SPICED data, close date",
      "crm.people — contacts with buying roles, job titles, LinkedIn",
      "Entity matching via atom_id → source_id",
    ],
  },
  {
    id: "modjo",
    name: "Modjo Calls",
    icon: Phone,
    status: "active",
    description: "Call recordings, AI scoring, themes from conversation data",
    category: "adapter",
    capabilities: ["GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "call_frequency_drop", score: -4 },
      { name: "high_call_volume", score: 3 },
      { name: "low_ai_call_score", score: -5 },
      { name: "high_ai_call_score", score: 4 },
      { name: "call_churn_mentions", score: -6 },
      { name: "call_negative_sentiment", score: -3 },
      { name: "call_objection_cluster", score: -4 },
      { name: "call_expansion_signals", score: 4 },
    ],
    stats: {
      "Total calls": "22,661",
      "Summaries analyzed": "2,429",
      "Entity match rate": "~86%",
    },
    details: [
      "Table: call_recordings.modjo_calls (BQ atom-ai-hub)",
      "Matching: email → contacts → domain fallback → account name",
      "AI scoring: 0-100, 29% coverage. Avg call: 44min",
      "SPICED extraction: Situation, Pain, Impact, Critical Event, Decision",
    ],
  },
  {
    id: "intercom",
    name: "Intercom",
    icon: MessageSquare,
    status: "active",
    description: "Support conversations — tickets, CSAT, churn alerts, sentiment",
    category: "adapter",
    capabilities: ["GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "high_ticket_volume", score: -4 },
      { name: "slow_first_reply", score: -3 },
      { name: "slow_resolution", score: -4 },
      { name: "churn_alert_flagged", score: -8 },
      { name: "escalation_spike", score: -5 },
      { name: "negative_sentiment_support", score: -3 },
      { name: "high_ai_resolution", score: 3 },
      { name: "positive_csat", score: 4 },
    ],
    stats: {
      "Conversations": "241",
      "Companies matched": "86",
    },
    details: [
      "API: api.intercom.io (Bearer token, v2.11)",
      "Workspace: Atom (mr1xfx3a), 12,290 companies",
      "Custom attrs: Categoría, Módulo Afectado, Sentiment, Alerta de Churn",
      "CSAT ratings, Fin AI resolution tracking, escalation tags",
    ],
  },
];

export const KNOWLEDGE_SOURCES: SourceNode[] = [
  {
    id: "notion",
    name: "Notion",
    icon: BookOpen,
    status: "active",
    description: "ICP definitions, playbooks, benchmarks, best practices",
    category: "knowledge",
    stats: { "Entries": "38" },
    details: [
      "5 ICP profiles, 8 feature docs, 8 playbooks",
      "5 benchmarks, 4 best practices, 4 objection responses, 4 use cases",
      "All with OpenAI embeddings for semantic search",
    ],
  },
  {
    id: "atom-doc",
    name: "Atom-Doc (GitHub)",
    icon: FileCode,
    status: "active",
    description: "FlowBuilder components, patterns, rules documentation",
    category: "knowledge",
    stats: { "Entries": "51" },
    details: [
      "FlowBuilder component reference",
      "Flow patterns and best practices",
      "Parsing rules for flow_parser.py",
    ],
  },
  {
    id: "hubspot-tickets",
    name: "HubSpot Tickets",
    icon: CreditCard,
    status: "active",
    description: "17K support tickets → 93 support patterns by module & category",
    category: "knowledge",
    stats: { "Entries": "93", "Source tickets": "17,000" },
    details: [
      "Claude Haiku classified and summarized tickets by module × category",
      "Includes churn alert patterns (100 tickets) and critical incidents (1,201)",
      "Categories: support_pattern. Surfaced automatically by KB search",
    ],
  },
];

export const STUB_SOURCES: SourceNode[] = [];

export const PLANNED_SOURCES: SourceNode[] = [];

// ── Central Database ───────────────────────────────────

export const CENTRAL_DATABASE: SourceNode = {
  id: "supabase",
  name: "Supabase (PostgreSQL)",
  icon: Database,
  status: "active",
  description: "Central database — clients, signals, patterns, knowledge base, similarities",
  category: "adapter",
  stats: {
    "Tables": "30+",
    "Clients": "1,418",
    "Signals": "~2,400",
    "KB Entries": "182",
    "Deals": "synced from CRM",
    "Call Summaries": "2,429",
    "Similarity Pairs": "44,058",
    "Pattern Matches": "26",
  },
  details: [
    "Tables: clients, contacts, signals, patterns, pattern_matches, knowledge_base",
    "Tables: client_similarities, client_flows, call_summaries, csm_interactions",
    "Tables: entity_aliases, contact_interactions",
    "Region: us-east-1, Project ID: btyezocjiqlbkmsmmwtn",
    "Org: Atom (Supabase dashboard)",
  ],
};

// ── Processing Steps ───────────────────────────────────

export const PROCESSING_STEPS: ProcessingNode[] = [
  {
    id: "signals",
    name: "Signal Generation",
    icon: Zap,
    metric: "~2,100 signals",
    description: "Scored events from all adapters, -10 to +10",
    details: [
      "7-day dedup window per client/subtype",
      "Signal categories: usage, engagement, contract, support, expansion",
      "Temporal decay: 100% (today) → 10% (90 days)",
    ],
  },
  {
    id: "patterns",
    name: "Pattern Matching",
    icon: Search,
    metric: "8 patterns",
    description: "Cross-signal pattern detection across clients",
    details: [
      "Patterns: churn_risk, expansion, success, stall, nps_crisis, silent_churn, renewal_risk, adoption_gap",
      "Confidence scoring with thresholds",
      "20 active pattern matches",
    ],
  },
  {
    id: "health",
    name: "Health Scoring",
    icon: Brain,
    metric: "1,418 clients",
    description: "Weighted composite score with temporal decay",
    details: [
      "Weights: usage 30%, engagement 25%, contract 20%, support 15%, patterns 10%",
      "Temporal decay: linear 100% → 10% over 90 days (DECAY_FLOOR=0.1)",
      "Distribution: 650 stable, 343 at_risk, 7 critical",
    ],
  },
  {
    id: "similarity",
    name: "Similarity Engine",
    icon: GitCompare,
    metric: "44K pairs",
    description: "6-dimension weighted similarity scoring",
    details: [
      "Dimensions: industry, size, MRR bucket, lifecycle, signal Jaccard, plan",
      "Used for 'similar clients' in Context Cards",
      "Recalculated on each sync",
    ],
  },
  {
    id: "context-assembly",
    name: "Context Assembly",
    icon: Layers,
    metric: "5min cache",
    description: "Parallel async assembly with Claude agent loop",
    details: [
      "6 parallel DB queries (Phase 1) + 2 parallel (Phase 2)",
      "Context Card agent: max 3 tool rounds (search_knowledge, similar_client, call_insights, past_interactions)",
      "Portfolio Q&A agent: max 3 tool rounds (query_clients, aggregate, signals, client_detail, call_summaries, search_knowledge)",
      "Frontend merges metadata from all client entries (BQ + Vitally + manual) for complete view",
      "In-memory TTL cache (5min default), bypass for eval",
    ],
  },
];

// ── Outputs ────────────────────────────────────────────

export const OUTPUTS: OutputNode[] = [
  {
    id: "context-cards",
    name: "Context Cards",
    icon: Layers,
    description: "AI-generated client intelligence summaries",
    destination: "Platform + Slack",
  },
  {
    id: "chat-ai",
    name: "Chat AI",
    icon: Bot,
    description: "Natural language queries about any client or portfolio",
    destination: "Platform + Slack",
  },
  {
    id: "slack-bot",
    name: "Slack Bot",
    icon: MessageSquare,
    description: "/brain commands + @mention NL with 6 tools + thread follow-ups",
    destination: "Slack workspace",
  },
  {
    id: "dashboards",
    name: "Dashboards",
    icon: BarChart3,
    description: "Portfolio health, patterns, signals, risk monitoring",
    destination: "Platform",
  },
];

// ── Ingestion Capabilities ─────────────────────────────

export const INGESTION_STEPS = [
  { label: "Sync Clients", description: "Create/update client records" },
  { label: "Sync Contacts", description: "Create/update contact records" },
  { label: "Generate Signals", description: "Detect and score events" },
  { label: "KB Ingestion", description: "Embed knowledge base entries" },
];

// ── Summary Stats ──────────────────────────────────────

export const SUMMARY_STATS = {
  activeSources: DATA_SOURCES.length + KNOWLEDGE_SOURCES.length,
  totalClients: 1418,
  totalSignals: "~2,400",
  kbEntries: 182,
  syncSchedule: "Daily 9AM ART",
};
