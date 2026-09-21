import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { confirmProdWrite } from "./prod-write-guard";

const TEST_SLUGS = ["producto-prueba", "labial-pink-21"];

async function main() {
  await confirmProdWrite("despublicar/marcar borrados los productos de prueba");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { slug: { in: TEST_SLUGS } },
          { name: { contains: "Eduardo", mode: "insensitive" } },
          { name: { contains: "prueba", mode: "insensitive" } },
        ],
      },
    });

    console.log(`Encontrados ${products.length} productos de prueba coincidentes.`);

    for (const p of products) {
      console.log(`- Despublicando: ${p.name} (id: ${p.id}, slug: ${p.slug})`);
      await prisma.product.update({
        where: { id: p.id },
        data: {
          active: false,
          deletedAt: new Date(),
          isFeatured: false,
        },
      });
      await prisma.productVariant.updateMany({
        where: { productId: p.id },
        data: { active: false, stock: 0 },
      });
    }

    console.log("Listo: productos de prueba despublicados y desactivados.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
