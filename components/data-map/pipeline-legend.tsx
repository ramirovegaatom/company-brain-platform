import { Card, CardContent } from "@/components/ui/card";
import {
  Database,
  Users,
  Zap,
  BookOpen,
  Clock,
} from "lucide-react";
import { SUMMARY_STATS } from "@/lib/architecture-data";

export function PipelineLegend() {
  return (
    <div className="space-y-4">
      {/* Legend dots */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-500" />
          Active
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-500" />
          Stub (code exists)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-dashed border-foreground/30 bg-transparent" />
          Planned
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Database} label="Active Sources" value={String(SUMMARY_STATS.activeSources)} />
        <StatCard icon={Users} label="Clients" value={String(SUMMARY_STATS.totalClients)} />
        <StatCard icon={Zap} label="Signals" value={String(SUMMARY_STATS.totalSignals)} />
        <StatCard icon={BookOpen} label="KB Entries" value={String(SUMMARY_STATS.kbEntries)} />
        <StatCard icon={Clock} label="Sync Schedule" value={SUMMARY_STATS.syncSchedule} />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3 !py-2">
        <Icon className="size-4 text-muted-foreground shrink-0" />
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-sm font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
