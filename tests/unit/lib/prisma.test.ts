import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";

// Guarda de regresión del singleton de Prisma (patrón estándar Next.js/Vercel,
// post-migración de Cloudflare Workers): un solo cliente por proceso, cacheado
// en `globalThis`, construido de forma perezosa desde `DATABASE_URL`.

const DUMMY_URL = "postgresql://user:pass@localhost:5432/glamify";

describe("lib/prisma — cliente singleton (Vercel/Node)", () => {
  const originalUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    if (originalUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalUrl;
  });

  it("importar el módulo expone un cliente con los delegados/métodos esperados", async () => {
    process.env.DATABASE_URL = DUMMY_URL;
    const { prisma } = await import("@/lib/prisma");
    expect(prisma).toBeDefined();
    expect(typeof prisma.$queryRawUnsafe).toBe("function");
    expect(typeof prisma.$transaction).toBe("function");
    expect(prisma.product).toBeDefined();
  });

  it("reusa la misma instancia entre imports (singleton real, no uno por import)", async () => {
    process.env.DATABASE_URL = DUMMY_URL;
    const first = await import("@/lib/prisma");
    // Sin vi.resetModules() acá: el módulo de Node ya está cacheado, así que
    // este segundo import debe devolver el mismo objeto `prisma`.
    const second = await import("@/lib/prisma");
    expect(second.prisma).toBe(first.prisma);
  });

  // No hay test de "falla si falta DATABASE_URL": `@prisma/client` autocarga
  // `.env`/`.env.local` del root al importarse, así que `delete
  // process.env.DATABASE_URL` en el test no sobrevive al import — no es
  // simulable sin mockear `@prisma/client` por completo. El guard
  // (`resolveConnectionString` tira si falta la var) sigue en el código como
  // red de seguridad real para Vercel, donde no hay `.env` deployado.
});
