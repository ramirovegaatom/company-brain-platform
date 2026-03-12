"use client";

import { useState, useCallback } from "react";
import { AccountsToolbar } from "@/components/accounts/accounts-toolbar";
import { AccountsTable } from "@/components/accounts/accounts-table";
import { useClients } from "@/hooks/use-clients";
import type { HealthRange, SortField, SortDirection } from "@/lib/types";

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const [lifecycleStage, setLifecycleStage] = useState("all");
  const [healthRange, setHealthRange] = useState<HealthRange>("all");
  const [sortField, setSortField] = useState<SortField>("health_score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { clients, total, isLoading, error } = useClients({
    search,
    lifecycleStage,
    healthRange,
    sortField,
    sortDirection,
  });

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection(field === "name" ? "asc" : "desc");
      }
    },
    [sortField]
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Explorá, filtrá y analizá la inteligencia de cuentas.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <AccountsToolbar
        search={search}
        onSearchChange={setSearch}
        lifecycleStage={lifecycleStage}
        onLifecycleChange={setLifecycleStage}
        healthRange={healthRange}
        onHealthRangeChange={setHealthRange}
        showing={clients.length}
        total={total}
      />

      <AccountsTable
        clients={clients}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}
