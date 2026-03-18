"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  Bot,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupportSummary, IntercomConversation } from "@/lib/types";

interface SupportHistoryProps {
  data: SupportSummary | null;
  isLoading: boolean;
  error: string | null;
}

// --- Helpers ---

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "—";
  const hours = seconds / 3600;
  if (hours < 1) return `${Math.round(seconds / 60)}min`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const stateBadge: Record<string, string> = {
  open: "bg-amber-400/15 text-amber-400",
  snoozed: "bg-purple-400/15 text-purple-400",
  closed: "bg-emerald-400/15 text-emerald-400",
};

const sentimentBadge: Record<string, string> = {
  Positive: "bg-emerald-400/15 text-emerald-400",
  Negative: "bg-red-400/15 text-red-400",
  Neutral: "bg-muted text-muted-foreground",
  Frustrated: "bg-red-400/15 text-red-400",
};

const priorityBadge: Record<string, string> = {
  HIGH: "bg-red-400/15 text-red-400",
  MEDIUM: "bg-amber-400/15 text-amber-400",
  LOW: "bg-muted text-muted-foreground",
};

// --- Sub-components ---

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-foreground/10 bg-card px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}

type SentimentFilter = "All" | "Positive" | "Negative" | "Neutral";
type StateFilter = "All" | "open" | "closed";

function FilterBar({
  sentiment,
  onSentiment,
  state,
  onState,
}: {
  sentiment: SentimentFilter;
  onSentiment: (v: SentimentFilter) => void;
  state: StateFilter;
  onState: (v: StateFilter) => void;
}) {
  const sentimentOptions: SentimentFilter[] = ["All", "Positive", "Negative", "Neutral"];
  const stateOptions: { label: string; value: StateFilter }[] = [
    { label: "All", value: "All" },
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Sentiment:</span>
        {sentimentOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => onSentiment(opt)}
            className={cn(
              "rounded-md px-2 py-0.5 text-xs transition-colors",
              sentiment === opt
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">State:</span>
        {stateOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onState(opt.value)}
            className={cn(
              "rounded-md px-2 py-0.5 text-xs transition-colors",
              state === opt.value
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConversationCard({ conv }: { conv: IntercomConversation }) {
  const [expanded, setExpanded] = useState(false);

  const subject = conv.subject || conv.body?.slice(0, 80) || "Sin asunto";
  const isEscalated = conv.tags?.includes("Escalado");

  return (
    <Card size="sm">
      <CardContent className="p-3">
        <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="font-medium truncate max-w-[300px]">{subject}</span>
                <span className={cn("rounded-md px-1.5 py-0.5 text-xs", stateBadge[conv.state] || "bg-muted text-muted-foreground")}>
                  {conv.state}
                </span>
                {conv.sentiment && (
                  <span className={cn("rounded-md px-1.5 py-0.5 text-xs", sentimentBadge[conv.sentiment] || "bg-muted text-muted-foreground")}>
                    {conv.sentiment}
                  </span>
                )}
                {conv.priority && (
                  <span className={cn("rounded-md px-1.5 py-0.5 text-xs", priorityBadge[conv.priority] || "bg-muted text-muted-foreground")}>
                    {conv.priority}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{timeAgo(conv.created_at)}</span>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {conv.module && (
                  <span className="rounded-md bg-blue-400/15 text-blue-400 px-1.5 py-0.5 text-xs">
                    {conv.module}
                  </span>
                )}
                {conv.category && (
                  <span className="text-xs text-muted-foreground">{conv.category}</span>
                )}
                {conv.issue_type && (
                  <span className="text-xs text-muted-foreground">- {conv.issue_type}</span>
                )}
                {conv.ai_participated && (
                  <span className="rounded-md bg-purple-400/15 text-purple-400 px-1.5 py-0.5 text-xs flex items-center gap-0.5">
                    <Bot className="size-3" /> Fin AI
                  </span>
                )}
                {isEscalated && (
                  <span className="rounded-md bg-red-400/15 text-red-400 px-1.5 py-0.5 text-xs">
                    Escalado
                  </span>
                )}
                {conv.tags?.filter((t) => t !== "Escalado").map((tag) => (
                  <span key={tag} className="rounded-md bg-muted text-muted-foreground px-1.5 py-0.5 text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                {conv.time_to_first_reply_sec !== null && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="size-3" /> 1st reply: {formatDuration(conv.time_to_first_reply_sec)}
                  </span>
                )}
                {conv.time_to_resolution_sec !== null && (
                  <span>Resolution: {formatDuration(conv.time_to_resolution_sec)}</span>
                )}
                {conv.count_parts > 0 && <span>{conv.count_parts} msgs</span>}
                {conv.count_reopens > 0 && (
                  <span className="text-amber-400">{conv.count_reopens} reopen{conv.count_reopens !== 1 ? "s" : ""}</span>
                )}
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-foreground/5 space-y-3">
            {/* Churn alert banner */}
            {conv.churn_alert && (
              <div className="rounded-lg bg-red-400/10 border border-red-400/20 p-3 flex items-start gap-2">
                <AlertTriangle className="size-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-red-400">Churn Alert</div>
                  {conv.churn_reason && (
                    <div className="text-xs text-red-400/80 mt-0.5">{conv.churn_reason}</div>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            {conv.body && (
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {conv.body.slice(0, 800)}
                {conv.body.length > 800 && "..."}
              </div>
            )}

            {/* Solution */}
            {conv.solution && (
              <div className="rounded-lg bg-muted/30 p-3">
                <div className="text-xs font-medium mb-1">Solucion Soporte</div>
                <div className="text-xs text-muted-foreground">{conv.solution}</div>
              </div>
            )}

            {/* Footer details */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {conv.assignee_name && <span>Assignee: {conv.assignee_name}</span>}
              {conv.team_name && <span>Team: {conv.team_name}</span>}
              {conv.contact_name && <span>Contact: {conv.contact_name}</span>}
              {conv.contact_email && <span>({conv.contact_email})</span>}
              {conv.csat_rating !== null && (
                <span className={cn(conv.csat_rating >= 4 ? "text-emerald-400" : conv.csat_rating <= 2 ? "text-red-400" : "")}>
                  CSAT: {conv.csat_rating}/5
                  {conv.csat_remark && ` - "${conv.csat_remark}"`}
                </span>
              )}
              {conv.resolution_state && <span>Resolution: {conv.resolution_state}</span>}
              {conv.conversation_url && (
                <a
                  href={conv.conversation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="size-3" /> Intercom
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main component ---

export function SupportHistory({ data, isLoading, error }: SupportHistoryProps) {
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("All");
  const [stateFilter, setStateFilter] = useState<StateFilter>("All");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageSquare className="size-4" /> Soporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageSquare className="size-4" /> Soporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-400">Error cargando soporte: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.conversations.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-foreground/10 py-12 text-sm text-muted-foreground">
        Sin conversaciones de soporte registradas.
      </div>
    );
  }

  // Apply filters
  const filtered = data.conversations.filter((c) => {
    if (sentimentFilter !== "All" && c.sentiment !== sentimentFilter) return false;
    if (stateFilter !== "All" && c.state !== stateFilter) return false;
    return true;
  });

  const avgResolution = data.avg_resolution_sec
    ? formatDuration(data.avg_resolution_sec)
    : "—";

  const avgCsat = data.avg_csat !== null ? data.avg_csat.toFixed(1) : "No data";

  return (
    <div className="space-y-4">
      {/* KPI summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Conversaciones (90d)" value={String(data.total)} />
        <KpiCard label="Abiertas" value={String(data.open)} />
        <KpiCard label="Tiempo resolucion promedio" value={avgResolution} />
        <KpiCard label="CSAT promedio" value={avgCsat} />
      </div>

      {/* Filters */}
      <FilterBar
        sentiment={sentimentFilter}
        onSentiment={setSentimentFilter}
        state={stateFilter}
        onState={setStateFilter}
      />

      {/* Conversation list */}
      <div className="text-xs text-muted-foreground">
        {filtered.length} conversacion{filtered.length !== 1 ? "es" : ""}
        {(sentimentFilter !== "All" || stateFilter !== "All") && " (filtrado)"}
      </div>
      <div className="space-y-2">
        {filtered.map((conv) => (
          <ConversationCard key={conv.conversation_id} conv={conv} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Sin resultados con los filtros seleccionados.
        </div>
      )}
    </div>
  );
}
