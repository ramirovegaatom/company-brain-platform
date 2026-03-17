"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Megaphone } from "lucide-react";
import { getObjList } from "@/lib/metadata-utils";

interface CampaignTableProps {
  metadata: Record<string, unknown>;
}

export function CampaignTable({ metadata }: CampaignTableProps) {
  const campaigns = getObjList(metadata, "top_campaigns_30d");

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Megaphone className="size-4" /> Campañas (30d)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sin datos de campañas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Megaphone className="size-4" /> Top Campañas (30d)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Enviados</TableHead>
                <TableHead className="text-right">Lectura</TableHead>
                <TableHead className="text-right">Respuestas</TableHead>
                <TableHead className="text-right">Ventas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c, i) => {
                const cat = String(c.category || "N/A");
                const sub = String(c.sub_category || "");
                const delivered = Number(c.delivered || 0);
                const read = Number(c.read || 0);
                const answered = Number(c.answered || 0);
                const sales = Number(c.sales || 0);
                const readRate = delivered > 0 ? ((read / delivered) * 100).toFixed(0) + "%" : "—";

                return (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="text-sm font-medium">{cat}</div>
                      {sub && sub !== "N/A" && (
                        <div className="text-xs text-muted-foreground">{sub}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{delivered.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{readRate}</TableCell>
                    <TableCell className="text-right tabular-nums">{answered.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{sales.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
