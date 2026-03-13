"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { PatternHeatmapEntry } from "@/lib/types";

interface PatternHeatmapProps {
  data: PatternHeatmapEntry[];
}

function typeColor(type: string): string {
  switch (type) {
    case "churn_risk":
      return "bg-red-400/15 text-red-400";
    case "expansion_signal":
      return "bg-emerald-400/15 text-emerald-400";
    case "success_indicator":
      return "bg-blue-400/15 text-blue-400";
    case "stall_pattern":
      return "bg-amber-400/15 text-amber-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function PatternHeatmap({ data }: PatternHeatmapProps) {
  if (!data.length) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pattern Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No active patterns detected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Pattern Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs">Pattern</TableHead>
              <TableHead className="text-xs text-center w-16">Count</TableHead>
              <TableHead className="text-xs w-32">Confidence</TableHead>
              <TableHead className="text-xs">Top Clients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.pattern_name} className="border-border">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">{entry.pattern_name}</span>
                    <Badge variant="outline" className={`text-[10px] w-fit ${typeColor(entry.pattern_type)}`}>
                      {entry.pattern_type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold">{entry.count}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={entry.avg_confidence * 100} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {Math.round(entry.avg_confidence * 100)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {entry.top_clients.map((c) => (
                      <Link key={c.id} href={`/accounts/${c.id}`}>
                        <Badge
                          variant="outline"
                          className="text-[10px] cursor-pointer hover:bg-accent transition-colors border-border"
                        >
                          {c.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
