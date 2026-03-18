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
  category: "info_core" | "usage" | "experience" | "conversations" | "campaigns" | "calls" | "finance" | "crm";
  sourceDetail: SourceDetail;
}

// Source colors (consistent with data map)
const SRC = {
  atom_hub: "text-blue-400",
  vitally_csm: "text-purple-400",
  crm_hub: "text-indigo-400",
  vitally: "text-purple-400",
  bigquery: "text-blue-400",
  adoption: "text-cyan-400",
  modjo: "text-amber-400",
  labs: "text-teal-400",
  conv_logs: "text-emerald-400",
  hubspot_kb: "text-orange-400",
  intercom: "text-rose-400",
  finance: "text-yellow-400",
  computed: "text-muted-foreground",
};

// Reusable source detail templates — atom-ai-hub (centralized)
const HUB_INSIGHTS = { project: "atom-ai-hub", dataset: "atom", table: "companies_insights" };
const HUB_OUTBOUND = { project: "atom-ai-hub", dataset: "atom", table: "companies_outbound_analysis" };
const HUB_CONVS = { project: "atom-ai-hub", dataset: "atom", table: "conversation_message_history" };
const HUB_VITALLY = { project: "atom-ai-hub", dataset: "vitally_csm", table: "vitally_bigquery" };
const HUB_CRM_CO = { project: "atom-ai-hub", dataset: "crm", table: "companies" };
const HUB_CRM_DEALS = { project: "atom-ai-hub", dataset: "crm", table: "deals" };
const HUB_CRM_PEOPLE = { project: "atom-ai-hub", dataset: "crm", table: "people" };
const HUB_MODJO = { project: "atom-ai-hub", dataset: "call_recordings", table: "modjo_calls" };
const HUB_FINANCE_INV = { project: "atom-ai-hub", dataset: "finance", table: "maxio_invoices" };
const HUB_FINANCE_SUB = { project: "atom-ai-hub", dataset: "finance", table: "maxio_subscription" };
// Legacy (kept for reference, still used by Modjo adapter)
const MODJO_CALLS = { project: "atom-ai-hub", dataset: "call_recordings", table: "modjo_calls" };
const INTERCOM_API = { apiEndpoint: "https://api.intercom.io", notes: "Workspace: Atom (mr1xfx3a)" };

export const FIELD_SOURCES: FieldSource[] = [
  // ── Info Core ──
  { field: "mrr", label: "MRR", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "total_mrr" } },
  { field: "plan", label: "Plan", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "info_core", sourceDetail: { ...HUB_INSIGHTS, column: "plan" } },
  { field: "industry", label: "Industry", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "info_core", sourceDetail: { ...HUB_INSIGHTS, column: "industry" } },
  { field: "lifecycle_stage", label: "Lifecycle Stage", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "lifecycle_stage" } },
  { field: "country", label: "Country", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "info_core", sourceDetail: { ...HUB_INSIGHTS, column: "country" } },
  { field: "equipo_ongoing", label: "Equipo Ongoing", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "info_core", sourceDetail: { ...HUB_INSIGHTS, column: "equipo_ongoing" } },
  { field: "equipo_ongoing_propietario", label: "Equipo Propietario", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "equipo_ongoing_propietario" } },
  { field: "assigned_csm", label: "CSM Asignado", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "assigned_csm" } },
  { field: "assigned_ae", label: "AE Asignado", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "assigned_ae" } },
  { field: "revenue_proyectado", label: "Revenue Proyectado", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "revenue_proyectado" } },
  { field: "health_score", label: "Health Score", source: "Computed", sourceKey: "computed", sourceColor: SRC.computed, category: "info_core", sourceDetail: { notes: "Calculated by health_scoring.py from signals + patterns" } },
  { field: "icp_tier", label: "ICP Tier", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "icp_tier" } },
  { field: "partner_name", label: "Partner", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "partner_name" } },
  { field: "contexto_empresa", label: "Business Context", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "info_core", sourceDetail: { ...HUB_VITALLY, column: "contexto_de_la_empresa_y_modelo_de_negocio" } },

  // ── Usage / Consumo ──
  { field: "plan_conversaciones", label: "Plan (Convs Contratadas)", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "usage", sourceDetail: { ...HUB_VITALLY, column: "plan_conversations" } },
  { field: "conversaciones_actuales", label: "Convs Actuales", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "usage", sourceDetail: { ...HUB_VITALLY, column: "conversaciones_actuales" } },
  { field: "conversaciones_actuales_vs_plan", label: "Utilization %", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "usage", sourceDetail: { ...HUB_VITALLY, column: "conversaciones_actuales_vs_plan" } },
  { field: "conversaciones_vs_plan_3m", label: "Utilization 3M %", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "usage", sourceDetail: { ...HUB_VITALLY, column: "conversaciones_vs_plan_3m" } },
  { field: "conversations_started", label: "Convs Started (Daily)", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "conversations_started" } },
  { field: "tasa_abandono", label: "Tasa Abandono", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "tasa_abandono" } },
  { field: "nds_pct", label: "NDS (Nivel Servicio)", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "nds_pct" } },
  { field: "total_active_users", label: "Usuarios Activos", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "total_active_users" } },
  { field: "total_agent_users", label: "Agent Users", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "total_agent_users" } },
  { field: "templates_sended", label: "Templates Enviados", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "templates_sended" } },
  { field: "total_ai_cost", label: "AI Cost (USD)", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "total_ai_cost" } },
  { field: "total_tokens", label: "AI Tokens", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "total_tokens" } },
  { field: "bots_conectados", label: "Bots Conectados", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "bots_conectados" } },
  { field: "bots_flowbuilder_conectados", label: "FlowBuilder Bots", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "bots_flowbuilder_conectados" } },
  { field: "wa_flows_sended", label: "WA Flows Enviados", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "wa_flows_sended" } },
  { field: "outbound_bot_calls", label: "Outbound Bot Calls", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "outbound_bot_calls" } },
  { field: "ctwa_convs", label: "Click-to-WA Convs", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "usage", sourceDetail: { ...HUB_INSIGHTS, column: "ctwa_convs" } },

  // ── Finance (NEW) ──
  { field: "facturado_plan", label: "Facturado Plan", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "facturado_plan" } },
  { field: "facturado_excedente_mes_anterior", label: "Excedente Mes Anterior", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "facturado_excedente_mes_anterior" } },
  { field: "costo_de_excedentes", label: "Costo Excedentes", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "costo_de_excedentes" } },
  { field: "MRR_proy_excedente", label: "MRR Proy. Excedente", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "MRR_proy_excedente" } },
  { field: "facturas_vencidas", label: "Facturas Vencidas", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "facturas_vencidas" } },
  { field: "monto_facturas_vencidas", label: "Monto Fact. Vencidas", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "monto_facturas_vencidas" } },
  { field: "current_period_ends_at", label: "Fin Periodo Actual", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "current_period_ends_at" } },
  { field: "churn_razon", label: "Churn Reason", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "churn_razon" } },
  { field: "churn_oportunidades_de_mejora", label: "Churn Oportunidades", source: "Vitally CSM", sourceKey: "vitally_csm", sourceColor: SRC.vitally_csm, category: "finance", sourceDetail: { ...HUB_VITALLY, column: "churn_oportunidades_de_mejora_atom" } },

  // ── CRM (NEW) ──
  { field: "crm_icp_tier", label: "ICP Tier (CRM)", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "icp_tier" } },
  { field: "crm_assigned_csm", label: "CSM (CRM)", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "assigned_csm" } },
  { field: "crm_assigned_ae", label: "AE (CRM)", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "assigned_ae" } },
  { field: "crm_assigned_bdr", label: "BDR (CRM)", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "assigned_bdr" } },
  { field: "crm_outbound_stage", label: "Outbound Stage", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "outbound_stage" } },
  { field: "crm_partner_name", label: "Partner (CRM)", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "partner_name" } },
  { field: "crm_champion", label: "Champion", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "champion_buying_committee" } },
  { field: "crm_associated_deals", label: "Deals Asociados", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "associated_deals" } },
  { field: "crm_last_calendar_interaction", label: "Last Calendar", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "last_calendar_interaction" } },
  { field: "crm_last_email_interaction", label: "Last Email", source: "CRM Hub", sourceKey: "crm_hub", sourceColor: SRC.crm_hub, category: "crm", sourceDetail: { ...HUB_CRM_CO, column: "last_email_interaction" } },

  // ── Campaigns ──
  { field: "use_case_list", label: "Campaign Categories", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "campaigns", sourceDetail: { ...HUB_OUTBOUND, notes: "ARRAY_AGG(DISTINCT category)" } },
  { field: "top_campaigns_30d", label: "Top Campanas (30d)", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "campaigns", sourceDetail: { ...HUB_OUTBOUND, notes: "Top 5 by delivered" } },

  // ── Conversations ──
  { field: "conv_logs_total_30d", label: "Convs (30d)", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "conversations", sourceDetail: { ...HUB_CONVS, notes: "COUNT per-lead conversations" } },
  { field: "conv_logs_inbound_pct", label: "Inbound %", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "conversations", sourceDetail: { ...HUB_CONVS, notes: "Ratio inbound/total" } },
  { field: "conv_logs_outbound_pct", label: "Outbound %", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "conversations", sourceDetail: { ...HUB_CONVS, notes: "Ratio outbound/total" } },
  { field: "conv_logs_funnel_progression_pct", label: "Funnel Progression %", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "conversations", sourceDetail: { ...HUB_CONVS, notes: "Ratio advanced/total" } },
  { field: "conv_logs_avg_events", label: "Avg Msgs/Conv", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "conversations", sourceDetail: { ...HUB_CONVS, notes: "AVG(messages_count)" } },
  { field: "conv_logs_distinct_flows", label: "Flujos Distintos", source: "Atom Hub", sourceKey: "atom_hub", sourceColor: SRC.atom_hub, category: "conversations", sourceDetail: { ...HUB_CONVS, notes: "COUNT(DISTINCT flow_name)" } },

  // ── Calls (Modjo) ──
  { field: "total_calls_30d", label: "Calls (30d)", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "Aggregated from per-contact calls" } },
  { field: "total_calls_90d", label: "Calls (90d)", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "Aggregated from per-contact calls" } },
  { field: "last_call_date", label: "Last Call", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, column: "startDate" } },
  { field: "avg_call_duration_min", label: "Avg Duration (min)", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, column: "duration", notes: "FLOAT seconds → minutes" } },
  { field: "avg_ai_call_score", label: "AI Call Score", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "relations_aiScoringResults[].score (0-100)" } },
  { field: "call_themes_detected", label: "Call Themes", source: "Modjo", sourceKey: "modjo", sourceColor: SRC.modjo, category: "calls", sourceDetail: { ...MODJO_CALLS, notes: "Keyword detection from call_summaries.detected_themes" } },

  // ── Support (Intercom) ──
  { field: "intercom_convs_30d", label: "Support Convs (30d)", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "POST /conversations/search (30d window)" } },
  { field: "intercom_open_convs", label: "Open Conversations", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "state=open count" } },
  { field: "intercom_avg_first_reply_sec", label: "Avg First Reply (sec)", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "statistics.time_to_admin_reply" } },
  { field: "intercom_avg_resolution_sec", label: "Avg Resolution (sec)", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "statistics.time_to_first_close" } },
  { field: "intercom_escalation_count", label: "Escalations", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "Tag: Escalado" } },
  { field: "intercom_churn_alerts", label: "Churn Alerts", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "custom_attr: Alerta de Churn/Insatisfacción" } },
  { field: "intercom_top_modules", label: "Top Modules Affected", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "custom_attr: Módulo Afectado" } },
  { field: "intercom_ai_resolution_pct", label: "AI Resolution %", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "resolution_state + ai_agent_participated" } },
  { field: "intercom_csat_avg", label: "CSAT Average", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "conversation_rating.rating (1-5)" } },
  { field: "intercom_sentiment_distribution", label: "Sentiment Distribution", source: "Intercom", sourceKey: "intercom", sourceColor: SRC.intercom, category: "experience", sourceDetail: { ...INTERCOM_API, notes: "custom_attr: Sentiment" } },
];

export const CATEGORY_LABELS: Record<string, string> = {
  info_core: "Info Core",
  usage: "Usage & Adoption",
  finance: "Finance",
  crm: "CRM",
  experience: "Experience",
  conversations: "Conversations",
  campaigns: "Campaigns",
  calls: "Calls (Modjo)",
};

export const CATEGORY_ORDER = ["info_core", "finance", "usage", "crm", "campaigns", "conversations", "calls", "experience"];

// ── Source-level aggregation keys (matches adapter names) ──
export const SOURCE_KEYS = ["atom_hub", "vitally_csm", "crm_hub", "modjo", "intercom", "computed", "vitally", "bigquery", "adoption", "labs", "conv_logs"] as const;
export type SourceKey = (typeof SOURCE_KEYS)[number];

export const SOURCE_LABELS: Record<string, string> = {
  atom_hub: "Atom Hub (BQ)",
  vitally_csm: "Vitally CSM (BQ)",
  crm_hub: "CRM Hub (BQ)",
  modjo: "Modjo Calls",
  intercom: "Intercom",
  computed: "Computed",
  // Legacy (still in some signal sources)
  vitally: "Vitally",
  bigquery: "BigQuery (legacy)",
  adoption: "Adoption Intelligence (legacy)",
  labs: "Labs (legacy)",
  conv_logs: "Conversation Logs (legacy)",
};

export const SOURCE_COLORS: Record<string, string> = SRC;

// Signal source name (from API) → sourceKey mapping
export const SIGNAL_SOURCE_MAP: Record<string, string> = {
  atom_hub: "atom_hub",
  crm_hub: "crm_hub",
  vitally: "vitally_csm",
  bigquery: "atom_hub",
  bigquery_consumption: "atom_hub",
  adoption_intelligence: "atom_hub",
  modjo_calls: "modjo",
  modjo: "modjo",
  labs: "atom_hub",
  conversation_logs: "atom_hub",
  intercom: "intercom",
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
