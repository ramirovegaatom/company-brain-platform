import { ChevronRight, ChevronDown } from "lucide-react";

export function ConnectionChevron() {
  return (
    <>
      {/* Desktop: right arrow */}
      <div className="hidden lg:flex items-center justify-center">
        <ChevronRight className="size-6 text-muted-foreground/40" />
      </div>
      {/* Mobile: down arrow */}
      <div className="flex lg:hidden items-center justify-center py-2">
        <ChevronDown className="size-6 text-muted-foreground/40" />
      </div>
    </>
  );
}
