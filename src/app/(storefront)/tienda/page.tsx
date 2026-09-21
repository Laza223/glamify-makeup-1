import type { Metadata } from "next";
import { parseProductListParams } from "@/lib/catalog/filters";
import { getProductList, getCategoryTree } from "@/lib/catalog/queries";
import { filterVisibleInNav } from "@/lib/catalog/categories";
import { ProductListView } from "@/components/catalog/product-list-view";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Explorá todo el catálogo de maquillaje y accesorios.",
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, tree] = await Promise.all([
    parseProductListParams(await searchParams),
    getCategoryTree().then((t) => filterVisibleInNav(t)),
  ]);
  const result = await getProductList(params, null);
  return <ProductListView title="Tienda" result={result} categories={tree} />;
}
