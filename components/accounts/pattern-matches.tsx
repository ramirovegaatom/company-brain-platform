"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PatternMatchSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PatternMatchesProps {
  patterns: PatternMatchSummary[];
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "text-red-400";
  if (confidence >= 0.6) return "text-amber-400";
  return "text-blue-400";
}

export function PatternMatches({ patterns }: PatternMatchesProps) {
  if (patterns.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-foreground/10 py-12 text-sm text-muted-foreground">
        Sin patterns activos
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patterns.map((pattern, i) => (
        <Card key={i} size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{pattern.pattern_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">{pattern.description}</p>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Confianza</span>
                <span className={cn("text-xs font-medium", confidenceColor(pattern.confidence))}>
                  {Math.round(pattern.confidence * 100)}%
                </span>
              </div>
              <Progress value={pattern.confidence * 100} className="h-1.5" />
            </div>

            {pattern.similar_clients.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">Clientes similares:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pattern.similar_clients.map((name, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
