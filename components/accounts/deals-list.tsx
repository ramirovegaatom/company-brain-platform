"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Handshake, DollarSign, Clock, User } from "lucide-react";
import type { Deal, DealsResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DealsListProps {
  data: DealsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const STAGE_COLORS: Record<string, string> = {
  "discovery": "bg-blue-400/10 text-blue-400 border-blue-400/20",
  "qualification": "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  "proposal": "bg-amber-400/10 text-amber-400 border-amber-400/20",
  "negotiation": "bg-orange-400/10 text-orange-400 border-orange-400/20",
  "closed won": "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  "closed lost": "bg-red-400/10 text-red-400 border-red-400/20",
};

function getStageColor(stage: string | null): string {
  if (!stage) return "bg-muted text-muted-foreground";
  return STAGE_COLORS[stage.toLowerCase()] || "bg-muted text-muted-foreground";
}

function DealCard({ deal }: { deal: Deal }) {
  const hasSpiced = deal.spiced_data && Object.keys(deal.spiced_data).length > 0;

  return (
    <Card>
      <CardContent className="pt-4 pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium truncate">{deal.deal_name}</h4>
            {deal.owner && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                <User className="size-3" />
                {deal.owner}
              </div>
            )}
          </div>
          <Badge variant="outline" className={cn("text-xs shrink-0", getStageColor(deal.stage))}>
            {deal.stage || "Unknown"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {deal.value != null && deal.value > 0 && (
            <div className="flex items-center gap-1">
              <DollarSign className="size-3" />
              <span className="font-medium text-foreground">
                ${deal.value.toLocaleString()}
              </span>
              <span>{deal.currency}</span>
            </div>
          )}
          {deal.close_date && (
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              {deal.close_date}
            </div>
          )}
          {deal.source_system && (
            <span className="text-muted-foreground/60">{deal.source_system}</span>
          )}
        </div>

        {hasSpiced && (
          <div className="mt-2 space-y-1 border-t border-border/50 pt-2">
            {deal.spiced_data.pain && (
              <p className="text-xs">
                <span className="text-muted-foreground">Pain:</span>{" "}
                <span className="text-foreground">{deal.spiced_data.pain}</span>
              </p>
            )}
            {deal.spiced_data.situation && (
              <p className="text-xs">
                <span className="text-muted-foreground">Situation:</span>{" "}
                <span className="text-foreground">{deal.spiced_data.situation}</span>
              </p>
            )}
            {deal.spiced_data.critical_event && (
              <p className="text-xs">
                <span className="text-muted-foreground">Critical Event:</span>{" "}
                <span className="text-foreground">{deal.spiced_data.critical_event}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DealsList({ data, isLoading, error }: DealsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
        Error cargando deals: {error}
      </div>
    );
  }

  if (!data || data.deals.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Handshake className="mx-auto size-8 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Sin deals en el pipeline.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Total:</span>{" "}
          <span className="font-medium">{data.total}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Active:</span>{" "}
          <span className="font-medium">{data.active}</span>
        </div>
        {data.total_pipeline_value > 0 && (
          <div>
            <span className="text-muted-foreground">Pipeline:</span>{" "}
            <span className="font-medium text-emerald-400">
              ${data.total_pipeline_value.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Deal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
