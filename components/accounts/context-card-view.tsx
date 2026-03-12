"use client";

import { Brain, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContextCard } from "@/lib/types";

interface ContextCardViewProps {
  contextCard: ContextCard | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function ContextCardView({
  contextCard,
  isLoading,
  error,
  onRetry,
}: ContextCardViewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="size-4 animate-pulse" />
            <span className="text-sm">Generando inteligencia...</span>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-muted-foreground">
            Error generando Context Card: {error}
          </p>
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
            <RefreshCw className="size-3.5" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!contextCard) return null;

  const { justification, recommended_action } = contextCard;

  return (
    <div className="space-y-4">
      {/* Justification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="size-4" />
            Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm prose-invert max-w-none">
            {justification.split("\n").map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Action */}
      {recommended_action && (
        <Card>
          <CardHeader>
            <CardTitle>Acción Recomendada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium">{recommended_action.action}</p>

            {recommended_action.reasoning && (
              <p className="text-sm text-muted-foreground">
                {recommended_action.reasoning}
              </p>
            )}

            {recommended_action.talking_points.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Talking Points
                </p>
                <ul className="space-y-1.5">
                  {recommended_action.talking_points.map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-foreground/40 select-none">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommended_action.playbook && (
              <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                Playbook: {recommended_action.playbook}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
