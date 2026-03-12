"use client";

import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthBadge } from "./health-badge";
import type { Client, SortField, SortDirection } from "@/lib/types";
import { formatMRR, formatLifecycleLabel, getLifecycleColor } from "@/lib/health-utils";
import { cn } from "@/lib/utils";

interface AccountsTableProps {
  clients: Client[];
  isLoading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

function SortableHeader({
  label,
  field,
  currentField,
  currentDirection,
  onSort,
  className,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}) {
  const isActive = currentField === field;
  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {label}
        <ArrowUpDown
          className={cn(
            "size-3.5",
            isActive ? "text-foreground" : "text-muted-foreground/50"
          )}
        />
        {isActive && (
          <span className="sr-only">
            {currentDirection === "asc" ? "ascending" : "descending"}
          </span>
        )}
      </button>
    </TableHead>
  );
}

export function AccountsTable({
  clients,
  isLoading,
  sortField,
  sortDirection,
  onSort,
}: AccountsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Cuenta</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Lifecycle</TableHead>
              <TableHead>Plan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-foreground/10 py-16 text-muted-foreground">
        No se encontraron cuentas
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-foreground/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              label="Cuenta"
              field="name"
              currentField={sortField}
              currentDirection={sortDirection}
              onSort={onSort}
              className="w-[300px]"
            />
            <SortableHeader
              label="Health"
              field="health_score"
              currentField={sortField}
              currentDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label="MRR"
              field="mrr"
              currentField={sortField}
              currentDirection={sortDirection}
              onSort={onSort}
            />
            <TableHead>Lifecycle</TableHead>
            <TableHead>Plan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(`/accounts/${client.id}`)}
            >
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>
                <HealthBadge score={client.health_score} size="sm" />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatMRR(client.mrr)}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    getLifecycleColor(client.lifecycle_stage)
                  )}
                >
                  {formatLifecycleLabel(client.lifecycle_stage)}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.plan || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
