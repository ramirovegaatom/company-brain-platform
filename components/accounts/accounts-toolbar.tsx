"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HealthRange } from "@/lib/types";

interface AccountsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  lifecycleStage: string;
  onLifecycleChange: (value: string) => void;
  healthRange: HealthRange;
  onHealthRangeChange: (value: HealthRange) => void;
  showing: number;
  total: number;
}

export function AccountsToolbar({
  search,
  onSearchChange,
  lifecycleStage,
  onLifecycleChange,
  healthRange,
  onHealthRangeChange,
  showing,
  total,
}: AccountsToolbarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 250);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cuenta..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={lifecycleStage} onValueChange={(v) => onLifecycleChange(v ?? "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Lifecycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
            <SelectItem value="growing">Growing</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="mature">Mature</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="churning">Churning</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>

        <Select value={healthRange} onValueChange={(v) => onHealthRangeChange((v ?? "all") as HealthRange)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Health</SelectItem>
            <SelectItem value="healthy">Healthy (80+)</SelectItem>
            <SelectItem value="stable">Stable (60-79)</SelectItem>
            <SelectItem value="at_risk">At Risk (40-59)</SelectItem>
            <SelectItem value="critical">Critical (&lt;40)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {showing} de {total} cuentas
      </span>
    </div>
  );
}
