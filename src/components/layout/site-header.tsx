import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeaderContent } from "@/components/layout/site-header-content";
import { getCategoryTree } from "@/lib/catalog/queries";
import { filterVisibleInNav } from "@/lib/catalog/categories";
import { getCartView } from "@/lib/cart/cart-view";

export async function SiteHeader() {
  const [tree, { count }] = await Promise.all([getCategoryTree(), getCartView()]);
  return (
    <header className="sticky top-0 z-30 transition-shadow duration-200">
      <AnnouncementBar />
      <SiteHeaderContent tree={filterVisibleInNav(tree)} count={count} />
    </header>
  );
}
