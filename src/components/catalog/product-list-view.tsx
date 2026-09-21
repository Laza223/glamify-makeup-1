import { ProductGrid } from "@/components/catalog/product-grid";
import { SortSelect } from "@/components/catalog/sort-select";
import { FilterSheet } from "@/components/catalog/filter-sheet";
import { ActiveFilterChips } from "@/components/catalog/active-filter-chips";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { CategoryChipsNav } from "@/components/catalog/category-chips-nav";
import type { ProductListResult } from "@/lib/catalog/queries";
import type { CategoryNode } from "@/lib/catalog/categories";

export function ProductListView({
  title,
  result,
  categories,
  activeSlug,
}: {
  title: string;
  result: ProductListResult;
  categories?: CategoryNode[];
  activeSlug?: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl font-normal text-foreground">{title}</h1>
        <div className="flex items-center gap-2">
          <FilterSheet />
          <SortSelect />
        </div>
      </div>

      {categories && categories.length > 0 && (
        <CategoryChipsNav categories={categories} activeSlug={activeSlug} />
      )}

      <ActiveFilterChips />
      <p className="text-xs md:text-sm text-muted-foreground">{result.total} productos</p>
      {result.items.length > 0 ? (
        <>
          <ProductGrid products={result.items} />
          <CatalogPagination page={result.page} totalPages={result.totalPages} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-medium">No encontramos productos</p>
          <p className="mt-1 text-sm text-muted-foreground">Probá quitar algún filtro.</p>
        </div>
      )}
    </section>
  );
}
