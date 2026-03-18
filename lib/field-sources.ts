// Maps each metadata field to its exact data source for the per-account Data Map.
// Used to show CSMs exactly where each piece of data comes from,
// including BQ project, dataset, table, and column.

export interface SourceDetail {
  project?: string;
  dataset?: string;
  table?: string;
  column?: string;
  apiEndpoint?: string;
  notes?: string;
}

export interface FieldSource {
  field: string;
  label: string;
  source: string;
  sourceKey: string;
  sourceColor: string;
  category: "info_core" | "usage" | "experience" | "conversations" | "campaigns" | "calls";
  sourceDetail: SourceDetail;
}

// Source colors (consistent with data map)
const SRC = {
  vitally: "text-purple-400",
  bigquery: "text-blue-400",
  adoption: "text-cyan-400",
  modjo: "text-amber-400",
  labs: "text-teal-400",
  conv_logs: "text-emerald-400",
  hubspot_kb: "text-orange-400",
  computed: "text-muted-foreground",
};

// Reusable source detail templates
const BQ_INFO = { project: "atomchat-io", dataset: "quick_wins", table: "info_empresas" };
const BQ_CONSUMO = { project: "atomchat-io", dataset: "metabase_internal", table: "alertas_consumo" };
const BQ_MRR = { project: "atomchat-io", dataset: "normalization", table: "revenue_base_mrr" };
const ADOPT_INFO = { project: "atom-ai-playground", dataset: "company_insights", table: "companies_info" };
const ADOPT_CAMP = { project: "atom-ai-playground", dataset: "company_insights", table: "company_use_cases_outbound" };
const MODJO_CALLS = { project: "atom-ai-playground", dataset: "company_insights", table: "modjo_calls" };
const LABS_TABLE = { project: "atom-ai-labs-ad1fa", dataset: "conversational_ai_lab", table: "first_30_messages_last_30_days" };
const CONV_LOGS = { project: "atom-ai-playground", dataset: "company_insights", table: "conversation_logs_history" };
const VITALLY_API = { apiEndpoint: "https://atomchat.rest.vitally.io/resources" };

export const FIELD_SOURCES: FieldSource[] = [
  // ── Info Core ──
  { field: "mrr", label: "MRR", source: "Vitally", sourceKey: "vitally", sourceColor: SRC.vitally, category: "info_core", sourceDetail: { ...VITALLY_API, notes: "account.mrr (via Vitally) or revenue_base_mrr (via BQ)" } },
  { field: "plan", label: "Plan", source: "Vitally", sourceKey: "vitally", sourceColor: SRC.vitally, category: "info_core", sourceDetail: { ...VITALLY_API, notes: "traits.atom_plan" } },
  { field: "industry", label: "Industry", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "info_core", sourceDetail: { ...BQ_INFO, column: "industry" } },
  { field: "lifecycle_stage", label: "Lifecycle Stage", source: "Vitally", sourceKey: "vitally", sourceColor: SRC.vitally, category: "info_core", sourceDetail: { ...VITALLY_API, notes: "mapped from state_subscription" } },
  { field: "country", label: "Country", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "info_core", sourceDetail: { ...BQ_INFO, column: "country" } },
  { field: "equipo_ongoing", label: "Equipo Ongoing", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "info_core", sourceDetail: { ...BQ_INFO, column: "equipo_ongoing" } },
  { field: "propietario_csm", label: "CSM Owner", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "info_core", sourceDetail: { ...BQ_CONSUMO, column: "propietario_csm" } },
  { field: "revenue_proyectado", label: "Revenue Proyectado", source: "Vitally", sourceKey: "vitally", sourceColor: SRC.vitally, category: "info_core", sourceDetail: { ...VITALLY_API, notes: "traits.revenue_proyectado" } },
  { field: "health_score", label: "Health Score", source: "Computed", sourceKey: "computed", sourceColor: SRC.computed, category: "info_core", sourceDetail: { notes: "Calculated by health_scoring.py from signals + patterns" } },
  { field: "vitally_health_score", label: "Vitally Health (0-10)", source: "Vitally", sourceKey: "vitally", sourceColor: SRC.vitally, category: "info_core", sourceDetail: { ...VITALLY_API, notes: "account.healthScore" } },
  { field: "nps_score", label: "NPS Score", source: "Vitally", sourceKey: "vitally", sourceColor: SRC.vitally, category: "info_core", sourceDetail: { ...VITALLY_API, notes: "account.npsScore" } },
  { field: "mrr_class", label: "MRR Class", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "info_core", sourceDetail: { ...BQ_MRR, column: "class" } },
  { field: "products", label: "Products", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "info_core", sourceDetail: { ...BQ_MRR, column: "product_name" } },

  // ── Usage / Consumo ──
  { field: "plan_conversaciones", label: "Plan (Convs Contratadas)", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_CONSUMO, column: "conversaciones_contratadas" } },
  { field: "conversaciones_actuales", label: "Convs Actuales (Facturadas)", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_CONSUMO, column: "conversaciones_facturadas" } },
  { field: "conversaciones_actuales_vs_plan", label: "Utilization %", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_CONSUMO, notes: "Computed: facturadas / contratadas" } },
  { field: "conversations_started", label: "Convs Started (Snapshot)", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_INFO, column: "conversations_started" } },
  { field: "tasa_abandono", label: "Tasa Abandono", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_INFO, column: "tasa_abandono" } },
  { field: "nds_pct", label: "NDS (Nivel Servicio)", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_INFO, column: "nds_pct" } },
  { field: "total_active_users", label: "Usuarios Activos", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_INFO, column: "total_active_users" } },
  { field: "total_agent_users", label: "Agent Users", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_INFO, column: "total_agent_users" } },
  { field: "templates_sended", label: "Templates Enviados", source: "BigQuery", sourceKey: "bigquery", sourceColor: SRC.bigquery, category: "usage", sourceDetail: { ...BQ_INFO, column: "templates_sended" } },

  // ── Adoption (Features) ──
  { field: "total_ai_cost", label: "AI Cost (USD)", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "total_ai_cost" } },
  { field: "total_tokens", label: "AI Tokens", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "total_tokens" } },
  { field: "bots_conectados", label: "Bots Conectados", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "bots_conectados" } },
  { field: "bots_flowbuilder_conectados", label: "FlowBuilder Bots", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "bots_flowbuilder_conectados" } },
  { field: "wa_flows_sended", label: "WA Flows Enviados", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "wa_flows_sended" } },
  { field: "outbound_bot_calls", label: "Outbound Bot Calls", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "outbound_bot_calls" } },
  { field: "ctwa_convs", label: "Click-to-WA Convs", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "ctwa_convs" } },
  { field: "hubspot_deals", label: "HubSpot Deals", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "usage", sourceDetail: { ...ADOPT_INFO, column: "hubspot_deals" } },
  { field: "use_case_list", label: "Campaign Categories", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "campaigns", sourceDetail: { ...ADOPT_CAMP, notes: "ARRAY_AGG(DISTINCT category)" } },

  // ── Campaigns ──
  { field: "top_campaigns_30d", label: "Top Campanas (30d)", source: "Adoption Intelligence", sourceKey: "adoption", sourceColor: SRC.adoption, category: "campaigns", sourceDetail: { ...ADOPT_CAMP, notes: "Top 5 by delivered, with read/answered/sales" } },

  // ── Conversations ──
  { field: "conv_logs_total_30d", label: "Convs (30d, granular)", source: "Conversation Logs", sourceKey: "conv_logs", sourceColor: SRC.conv_logs, category: "conversations", sourceDetail: { ...CONV_LOGS, notes: "COUNT per-lead conversations" } },
  { field: "conv_logs_inbound_pct", label: "Inbound %", source: "Conversation Logs", sourceKey: "conv_logs", sourceColor: SRC.conv_logs, category: "conversations", sourceDetail: { ...CONV_LOGS, notes: "Ratio inbound/total" } },
  { field: "conv_logs_outbound_pct", label: "Outbound %", source: "Conversation Logs", sourceKey: "conv_logs", sourceColor: SRC.conv_logs, category: "conversations", sourceDetail: { ...CONV_LOGS, notes: "Ratio outbound/total" } },
  { field: "conv_logs_funnel_progression_pct", label: "Funnel Progression %", source: "Conversation Logs", sourceKey: "conv_logs", sourceColor: SRC.conv_logs, category: "conversations", sourceDetail: { ...CONV_LOGS, notes: "Ratio (MQL+SQL)/total" } },
  { field: "conv_logs_no_response_pct", label: "No-Response Rate", source: "Conversation Logs", sourceKey: "conv_logs", sourceColor: SRC.conv_logs, category: "conversations", sourceDetail: { ...CONV_LOGS, notes: "Ratio no-response typifications/total" } },
  { field: "conv_logs_avg_events", label: "Avg Events/Conv", source: "Conversation Logs", sourceKey: "conv_logs", sourceColor: SRC.conv_logs, category: "conversations", sourceDetail: { ...CONV_LOGS, notes: "avg_events_per_conversation" } },
  { field: "conv_logs_distinct_flows", label: "Flujos Distintos", source: "Conversation Logs", sourceKey: "conv_logs", sourceColor: SRC.conv_logs, category: "conversations", sourceDetail: { ...CONV_LOGS, notes: "COUNT(DISTINCT flow_name)" } },
  { field: "labs_total_conversations_30d", label: "Convs (30d, aggregate)", source: "Labs", sourceKey: "labs", sourceColor: SRC.labs, category: "conversations", sourceDetail: { ...LABS_TABLE, notes: "total_conversations" } },
  { field: "labs_bot_handled_pct", label: "Bot Handled %", source: "Labs", sourceKey: "labs", sourceColor: SRC.labs, category: "conversations", sourceDetail: { ...LABS_TABLE, notes: "bot_handled / total_handled" } },
  { field: "labs_human_handled_pct", label: "Human Handled %", source: "Labs", sourceKey: "labs", sourceColor: SRC.labs, category: "conversations", sourceDetail: { ...LABS_TABLE, notes: "human_handled / total_handled" } },
  { field: "labs_avg_messages", label: "Avg Msgs/Conv", source: "Labs", sourceKey: "labs", sourceColor: SRC.labs, category: "conversations", sourceDetail: { ...LABS_TABLE, notes: "avg_messages" } },
  { field: "labs_top_flow_name", label: "Top Flow", source: "Labs", sourceKey: "labs", sourceColor: SRC.labs, category: "conversations", sourceDetail: { ...LABS_TABLE, notes: "flow_name (top by count)" } },

  // ── Calls (Modjo) ──
  { field: "total_calls_30d", label: "Calls (30d)", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "Aggregated from per-contact calls" } },
  { field: "total_calls_90d", label: "Calls (90d)", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "Aggregated from per-contact calls" } },
  { field: "last_call_date", label: "Last Call", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, column: "startDate" } },
  { field: "avg_call_duration_min", label: "Avg Duration (min)", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, column: "duration", notes: "FLOAT seconds → minutes" } },
  { field: "avg_ai_call_score", label: "AI Call Score", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "relations_aiScoringResults[].score (0-100)" } },
  { field: "call_themes_detected", label: "Call Themes", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "Keyword detection from call_summaries.detected_themes" } },
];

export const CATEGORY_LABELS: Record<string, string> = {
  info_core: "Info Core",
  usage: "Usage & Adoption",
  experience: "Experience",
  conversations: "Conversations",
  campaigns: "Campaigns",
  calls: "Calls (Modjo)",
};

export const CATEGORY_ORDER = ["info_core", "usage", "campaigns", "conversations", "calls"];

// ── Source-level aggregation keys (matches adapter names) ──
export const SOURCE_KEYS = ["vitally", "bigquery", "adoption", "modjo", "labs", "conv_logs", "computed"] as const;
export type SourceKey = (typeof SOURCE_KEYS)[number];

export const SOURCE_LABELS: Record<string, string> = {
  vitally: "Vitally",
  bigquery: "BigQuery",
  adoption: "Adoption Intelligence",
  modjo: "Modjo Calls",
  labs: "Labs Conversations",
  conv_logs: "Conversation Logs",
  computed: "Computed",
};

export const SOURCE_COLORS: Record<string, string> = SRC;

// Signal source name (from API) → sourceKey mapping
export const SIGNAL_SOURCE_MAP: Record<string, string> = {
  vitally: "vitally",
  bigquery: "bigquery",
  bigquery_consumption: "bigquery",
  adoption_intelligence: "adoption",
  modjo_calls: "modjo",
  modjo: "modjo",
  labs: "labs",
  conversation_logs: "conv_logs",
};

// ── Helpers ──

export function getSourceKeysForClient(
  meta: Record<string, unknown>,
  clientFields?: Record<string, unknown>,
): Set<string> {
  const keys = new Set<string>();
  for (const f of FIELD_SOURCES) {
    let v = meta[f.field];
    if ((v === null || v === undefined) && clientFields) {
      v = clientFields[f.field];
    }
    if (v !== null && v !== undefined && v !== "" && v !== 0) {
      keys.add(f.sourceKey);
    }
  }
  return keys;
}

export function getFieldsForSourceKey(sourceKey: string): FieldSource[] {
  return FIELD_SOURCES.filter((f) => f.sourceKey === sourceKey);
}

export function getFieldsByTable(sourceKey: string): Map<string, FieldSource[]> {
  const fields = getFieldsForSourceKey(sourceKey);
  const byTable = new Map<string, FieldSource[]>();
  for (const f of fields) {
    const table = f.sourceDetail.table || f.sourceDetail.apiEndpoint || "Other";
    if (!byTable.has(table)) byTable.set(table, []);
    byTable.get(table)!.push(f);
  }
  return byTable;
}
