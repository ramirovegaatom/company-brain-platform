"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  lifecycleStage: string;
  onLifecycleChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function DashboardFilters({
  lifecycleStage,
  onLifecycleChange,
  onRefresh,
  isLoading,
}: DashboardFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Select value={lifecycleStage} onValueChange={(v) => onLifecycleChange(v ?? "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Lifecycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lifecycle</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
            <SelectItem value="growing">Growing</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="mature">Mature</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="churning">Churning</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
        <RefreshCw className={`size-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
