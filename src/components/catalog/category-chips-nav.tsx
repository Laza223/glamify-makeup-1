import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/lib/catalog/categories";

interface CategoryChipsNavProps {
  categories: CategoryNode[];
  activeSlug?: string;
  className?: string;
}

export function CategoryChipsNav({
  categories,
  activeSlug,
  className,
}: CategoryChipsNavProps) {
  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0", className)}>
      <ul className="flex items-center gap-2 min-w-max">
        <li>
          <Link
            href="/tienda"
            className={cn(
              "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-all select-none border",
              !activeSlug
                ? "bg-[#161413] text-white border-[#161413] shadow-xs"
                : "bg-white/90 text-foreground border-border/80 hover:bg-secondary hover:text-primary hover:border-border"
            )}
          >
            Todo
          </Link>
        </li>
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return (
            <li key={cat.id}>
              <Link
                href={`/tienda/${cat.slug}`}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-all select-none border",
                  isActive
                    ? "bg-[#161413] text-white border-[#161413] shadow-xs"
                    : "bg-white/90 text-foreground border-border/80 hover:bg-secondary hover:text-primary hover:border-border"
                )}
              >
                {cat.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
