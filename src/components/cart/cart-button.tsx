"use client";

import { ShoppingBag } from "lucide-react";
import { useCartUI } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

export function CartButton({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  const { openCart, cartCount } = useCartUI();
  const displayCount = typeof cartCount === "number" ? cartCount : count;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Carrito${displayCount > 0 ? ` (${displayCount})` : ""}`}
      className={cn(
        "relative grid size-11 place-items-center rounded-full text-neutral-800 transition-colors hover:bg-muted hover:text-primary",
        className,
      )}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {displayCount > 0 && (
        <span className="shadow-xs absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold tabular-nums text-white">
          {displayCount}
        </span>
      )}
    </button>
  );
}
