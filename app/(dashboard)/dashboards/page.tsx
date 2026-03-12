import { PlaceholderPage } from "@/components/placeholder-page";
import { BarChart3 } from "lucide-react";

export default function DashboardsPage() {
  return (
    <PlaceholderPage
      title="Dashboards"
      description="Health del portfolio, distribución de riesgo y trends de MRR."
      icon={BarChart3}
      phase={4}
    />
  );
}
