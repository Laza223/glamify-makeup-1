import { Package, ShieldCheck, Truck } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-2 pt-2">
      <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/40 p-2.5">
        <Package
          className="size-3.5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <span className="text-[11px] font-medium leading-tight text-foreground">
          Empaque Seguro
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/40 p-2.5">
        <ShieldCheck
          className="size-3.5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <span className="text-[11px] font-medium leading-tight text-foreground">
          Compra Protegida
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/40 p-2.5">
        <Truck className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
        <span className="text-[11px] font-medium leading-tight text-foreground">
          Envío Nacional
        </span>
      </div>
    </div>
  );
}
