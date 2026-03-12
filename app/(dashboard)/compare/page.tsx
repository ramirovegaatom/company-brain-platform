import { PlaceholderPage } from "@/components/placeholder-page";
import { GitCompareArrows } from "lucide-react";

export default function ComparePage() {
  return (
    <PlaceholderPage
      title="Comparar Cuentas"
      description="Comparación side-by-side de 2-3 cuentas."
      icon={GitCompareArrows}
      phase={5}
    />
  );
}
