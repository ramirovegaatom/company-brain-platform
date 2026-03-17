// Maps each metadata field to its data source for the per-account Data Map.
// Used to show CSMs exactly where each piece of data comes from.

export interface FieldSource {
  field: string;
  label: string;
  source: string;
  sourceColor: string;
  category: "info_core" | "usage" | "experience" | "conversations" | "campaigns" | "calls";
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

export const FIELD_SOURCES: FieldSource[] = [
  // ── Info Core ──
  { field: "mrr", label: "MRR", source: "Vitally", sourceColor: SRC.vitally, category: "info_core" },
  { field: "plan", label: "Plan", source: "Vitally", sourceColor: SRC.vitally, category: "info_core" },
  { field: "industry", label: "Industry", source: "Vitally", sourceColor: SRC.vitally, category: "info_core" },
  { field: "lifecycle_stage", label: "Lifecycle Stage", source: "Vitally", sourceColor: SRC.vitally, category: "info_core" },
  { field: "country", label: "Country", source: "BigQuery", sourceColor: SRC.bigquery, category: "info_core" },
  { field: "equipo_ongoing", label: "Equipo Ongoing", source: "BigQuery", sourceColor: SRC.bigquery, category: "info_core" },
  { field: "revenue_proyectado", label: "Revenue Proyectado", source: "Vitally", sourceColor: SRC.vitally, category: "info_core" },
  { field: "health_score", label: "Health Score", source: "Computed", sourceColor: SRC.computed, category: "info_core" },
  { field: "vitally_health_score", label: "Vitally Health (0-10)", source: "Vitally", sourceColor: SRC.vitally, category: "info_core" },
  { field: "nps_score", label: "NPS Score", source: "Vitally", sourceColor: SRC.vitally, category: "info_core" },

  // ── Usage / Consumo ──
  { field: "conversaciones_contratadas", label: "Convs Contratadas (Plan)", source: "BigQuery", sourceColor: SRC.bigquery, category: "usage" },
  { field: "conversaciones_actuales", label: "Convs Actuales", source: "Vitally", sourceColor: SRC.vitally, category: "usage" },
  { field: "conversations_started", label: "Convs Started", source: "BigQuery", sourceColor: SRC.bigquery, category: "usage" },
  { field: "consumo_mes_anterior_porcentaje", label: "Consumo Mes Anterior %", source: "Vitally", sourceColor: SRC.vitally, category: "usage" },
  { field: "tasa_abandono", label: "Tasa Abandono", source: "BigQuery", sourceColor: SRC.bigquery, category: "usage" },
  { field: "nds_pct", label: "NDS (Nivel Servicio)", source: "BigQuery", sourceColor: SRC.bigquery, category: "usage" },
  { field: "total_active_users", label: "Usuarios Activos", source: "BigQuery / Vitally", sourceColor: SRC.bigquery, category: "usage" },
  { field: "templates_sended", label: "Templates Enviados", source: "BigQuery", sourceColor: SRC.bigquery, category: "usage" },

  // ── Adoption (Features) ──
  { field: "total_ai_cost", label: "AI Cost (USD)", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "usage" },
  { field: "total_tokens", label: "AI Tokens", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "usage" },
  { field: "bots_conectados", label: "Bots Conectados", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "usage" },
  { field: "wa_flows_sended", label: "WA Flows Enviados", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "usage" },
  { field: "outbound_bot_calls", label: "Outbound Bot Calls", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "usage" },
  { field: "ctwa_convs", label: "Click-to-WA Convs", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "usage" },
  { field: "hubspot_deals", label: "HubSpot Deals", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "usage" },
  { field: "use_case_list", label: "Campaign Categories", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "campaigns" },

  // ── Campaigns ──
  { field: "top_campaigns_30d", label: "Top Campañas (30d)", source: "Adoption Intelligence", sourceColor: SRC.adoption, category: "campaigns" },

  // ── Conversations ──
  { field: "conv_logs_total_30d", label: "Convs (30d, granular)", source: "Conversation Logs", sourceColor: SRC.conv_logs, category: "conversations" },
  { field: "conv_logs_inbound_pct", label: "Inbound %", source: "Conversation Logs", sourceColor: SRC.conv_logs, category: "conversations" },
  { field: "conv_logs_outbound_pct", label: "Outbound %", source: "Conversation Logs", sourceColor: SRC.conv_logs, category: "conversations" },
  { field: "conv_logs_funnel_progression_pct", label: "Funnel Progression %", source: "Conversation Logs", sourceColor: SRC.conv_logs, category: "conversations" },
  { field: "conv_logs_no_response_pct", label: "No-Response Rate", source: "Conversation Logs", sourceColor: SRC.conv_logs, category: "conversations" },
  { field: "conv_logs_avg_events", label: "Avg Events/Conv", source: "Conversation Logs", sourceColor: SRC.conv_logs, category: "conversations" },
  { field: "conv_logs_distinct_flows", label: "Flujos Distintos", source: "Conversation Logs", sourceColor: SRC.conv_logs, category: "conversations" },
  { field: "labs_total_conversations_30d", label: "Convs (30d, aggregate)", source: "Labs", sourceColor: SRC.labs, category: "conversations" },
  { field: "labs_bot_handled_pct", label: "Bot Handled %", source: "Labs", sourceColor: SRC.labs, category: "conversations" },
  { field: "labs_human_handled_pct", label: "Human Handled %", source: "Labs", sourceColor: SRC.labs, category: "conversations" },
  { field: "labs_avg_messages", label: "Avg Msgs/Conv", source: "Labs", sourceColor: SRC.labs, category: "conversations" },
  { field: "labs_top_flow_name", label: "Top Flow", source: "Labs", sourceColor: SRC.labs, category: "conversations" },

  // ── Calls (Modjo) ──
  { field: "total_calls_30d", label: "Calls (30d)", source: "Modjo", sourceColor: SRC.modjo, category: "calls" },
  { field: "total_calls_90d", label: "Calls (90d)", source: "Modjo", sourceColor: SRC.modjo, category: "calls" },
  { field: "last_call_date", label: "Last Call", source: "Modjo", sourceColor: SRC.modjo, category: "calls" },
  { field: "avg_call_duration_min", label: "Avg Duration (min)", source: "Modjo", sourceColor: SRC.modjo, category: "calls" },
  { field: "avg_ai_call_score", label: "AI Call Score", source: "Modjo", sourceColor: SRC.modjo, category: "calls" },
  { field: "call_themes_detected", label: "Call Themes", source: "Modjo", sourceColor: SRC.modjo, category: "calls" },
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
