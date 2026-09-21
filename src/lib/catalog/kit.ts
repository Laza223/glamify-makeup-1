import "server-only";
import { prisma } from "@/lib/prisma";
import { PRODUCT_INCLUDE } from "@/lib/catalog/queries";
import type { CatalogProduct } from "@/lib/catalog/types";

export interface KitStepItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  variants: Array<{
    id: string;
    name: string;
    swatchHex: string | null;
    stock: number;
  }>;
}

export async function getKitBuilderData() {
  const [labiosProds, ojosProds, rostroProds, curatedCombos] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        deletedAt: null,
        OR: [
          { category: { slug: "labios" } },
          { category: { parent: { slug: "labios" } } },
        ],
        variants: { some: { active: true, stock: { gt: 0 } } },
      },
      include: PRODUCT_INCLUDE,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
    prisma.product.findMany({
      where: {
        active: true,
        deletedAt: null,
        OR: [
          { category: { slug: "ojos" } },
          { category: { parent: { slug: "ojos" } } },
          { category: { slug: { in: ["pestanas", "delineador"] } } },
        ],
        variants: { some: { active: true, stock: { gt: 0 } } },
      },
      include: PRODUCT_INCLUDE,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
    prisma.product.findMany({
      where: {
        active: true,
        deletedAt: null,
        OR: [
          { category: { slug: "rostro" } },
          { category: { parent: { slug: "rostro" } } },
          { category: { slug: { in: ["rubor", "iluminador", "bases-y-correctores", "contorno"] } } },
        ],
        variants: { some: { active: true, stock: { gt: 0 } } },
      },
      include: PRODUCT_INCLUDE,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
    prisma.combo.findMany({
      where: { active: true },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      take: 4,
    }),
  ]);

  return {
    labios: labiosProds as CatalogProduct[],
    ojos: ojosProds as CatalogProduct[],
    rostro: rostroProds as CatalogProduct[],
    curatedCombos,
  };
}
