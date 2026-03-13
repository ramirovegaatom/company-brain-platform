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
    id: "vitally",
    name: "Vitally",
    icon: Activity,
    status: "active",
    description: "Customer success platform — clients, contacts, health traits",
    category: "adapter",
    capabilities: ["SYNC_CLIENTS", "SYNC_CONTACTS", "GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "health_score_drop", score: -7 },
      { name: "nps_detractor", score: -6 },
      { name: "nps_promoter", score: 5 },
      { name: "mrr_drop", score: -5 },
      { name: "mrr_increase", score: 4 },
      { name: "consumption_below_pace", score: -4 },
      { name: "consumption_over_pace", score: 3 },
      { name: "consumption_mom_decline", score: -3 },
      { name: "revenue_projection_gap", score: -5 },
      { name: "lifecycle_regression", score: -6 },
      { name: "churn_date_set", score: -8 },
      { name: "plan_downgrade", score: -4 },
    ],
    stats: { "Clients synced": "778", "Subdomain": "atomchat" },
    details: [
      "REST API: https://atomchat.rest.vitally.io/resources",
      "Traits: total_mrr, atom_plan, churn_date, atom_id",
      "Consumption: plan_conversaciones, conversaciones_actuales",
    ],
  },
  {
    id: "bigquery",
    name: "BigQuery (atomchat-io)",
    icon: Database,
    status: "active",
    description: "Core business data — usage metrics, revenue, consumption",
    category: "adapter",
    capabilities: ["SYNC_CLIENTS", "SYNC_CONTACTS", "GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "usage_drop", score: -5 },
      { name: "abandonment_increase", score: -6 },
      { name: "response_time_degradation", score: -4 },
      { name: "user_churn", score: -7 },
      { name: "usage_spike", score: 3 },
      { name: "new_user_activation", score: 4 },
      { name: "conversation_volume_drop", score: -4 },
      { name: "conversation_volume_spike", score: 3 },
      { name: "template_usage_change", score: -3 },
      { name: "channel_shift", score: -2 },
      { name: "bot_effectiveness_drop", score: -4 },
      { name: "response_time_improvement", score: 3 },
    ],
    stats: {
      "Project": "atomchat-io",
      "Gold table": "quick_wins.info_empresas",
      "Revenue table": "normalization.revenue_base_mrr",
    },
    details: [
      "Table: quick_wins.info_empresas (weekly company snapshots)",
      "Table: normalization.revenue_base_mrr (MRR per company/month)",
      "Table: metabase_internal.alertas_consumo (billed vs contracted)",
    ],
  },
  {
    id: "adoption",
    name: "Adoption Intelligence",
    icon: Cpu,
    status: "active",
    description: "Feature adoption & use case analysis from Pedro's dataset",
    category: "adapter",
    capabilities: ["GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "zero_outbound", score: -3 },
      { name: "zero_ai", score: -3 },
      { name: "zero_templates", score: -2 },
      { name: "zero_wa_flows", score: -3 },
      { name: "zero_bot_usage", score: -3 },
      { name: "ai_usage_drop", score: -4 },
      { name: "ai_usage_start", score: 4 },
      { name: "outbound_usage_drop", score: -4 },
      { name: "outbound_usage_start", score: 4 },
      { name: "wa_flows_activated", score: 4 },
      { name: "low_use_case_variety", score: -2 },
      { name: "high_use_case_variety", score: 3 },
      { name: "empty_funnel_top", score: -3 },
      { name: "hubspot_integration_active", score: 3 },
    ],
    stats: { "Signals generated": "343", "BQ project": "atom-ai-playground" },
    details: [
      "Table: company_insights.companies_info (361 active, weekly)",
      "Table: company_insights.company_use_cases_outbound (398 companies)",
      "Categories: Adquisición, Remarketing, Cobranzas, etc.",
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
      "Summaries analyzed": "2,068",
      "Entity match rate": "~86%",
    },
    details: [
      "Table: company_insights.modjo_calls (BQ atom-ai-playground)",
      "Matching: email → contacts → domain fallback → account name",
      "AI scoring: 0-100, 29% coverage. Avg call: 44min",
    ],
  },
  {
    id: "labs",
    name: "Labs Conversations",
    icon: MessageCircle,
    status: "active",
    description: "Bot/human handling, conversation volumes, flow performance",
    category: "adapter",
    capabilities: ["GENERATE_SIGNALS"],
    signalSubtypes: [
      { name: "low_bot_adoption", score: -3 },
      { name: "high_human_dependency", score: -4 },
      { name: "low_outbound_ratio", score: -2 },
      { name: "low_avg_messages", score: -2 },
      { name: "high_conversation_volume", score: 3 },
      { name: "no_conversation_data", score: -1 },
    ],
    stats: {
      "Clients matched": "443/465",
      "BQ project": "atom-ai-labs-ad1fa",
    },
    details: [
      "Table: conversational_ai_lab.first_30_messages_last_30_days",
      "Metrics: inbound/outbound %, bot/human handled %, avg messages",
      "Bulk query with UNNEST for handling detection",
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
];

export const STUB_SOURCES: SourceNode[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    icon: CreditCard,
    status: "stub",
    description: "CRM data — code exists but not yet configured",
    category: "adapter",
    capabilities: ["SYNC_CLIENTS", "SYNC_CONTACTS", "GENERATE_SIGNALS"],
    details: ["Adapter code exists in codebase", "Needs API key configuration"],
  },
];

export const PLANNED_SOURCES: SourceNode[] = [
  {
    id: "slack-interno",
    name: "Slack Interno",
    icon: MessageSquare,
    status: "planned",
    description: "Internal team conversations and escalations",
    category: "adapter",
    details: ["CSM conversations about clients", "Escalation patterns"],
  },
  {
    id: "asana",
    name: "Asana",
    icon: ListChecks,
    status: "planned",
    description: "Project tickets and task tracking",
    category: "adapter",
    details: ["Client-related tickets", "Implementation progress"],
  },
  {
    id: "atio",
    name: "Atio",
    icon: Globe,
    status: "planned",
    description: "Platform usage and product telemetry",
    category: "adapter",
    details: ["Direct platform usage data", "Feature adoption metrics"],
  },
];

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
    "Clients": "1,395",
    "Signals": "~1,900",
    "KB Entries": "89",
    "Similarity Pairs": "44,058",
    "Pattern Matches": "27",
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
    metric: "~1,900 signals",
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
      "27 active pattern matches",
    ],
  },
  {
    id: "health",
    name: "Health Scoring",
    icon: Brain,
    metric: "1,395 clients",
    description: "Weighted composite score with temporal decay",
    details: [
      "Weights: usage 30%, engagement 25%, contract 20%, support 15%, patterns 10%",
      "Temporal decay: linear 100% → 10% over 90 days (DECAY_FLOOR=0.1)",
      "Distribution: 655 stable, 330 at_risk, 15 critical",
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
      "Claude agent: max 3 tool rounds (search_knowledge, get_similar_client_detail, search_past_interactions)",
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
    destination: "Platform",
  },
  {
    id: "slack-bot",
    name: "Slack Bot",
    icon: MessageSquare,
    description: "/brain commands + @Company Brain mentions",
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
  totalClients: 1395,
  totalSignals: "~1,900",
  kbEntries: 89,
  syncSchedule: "Daily 9AM ART",
};
