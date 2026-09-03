import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export type PrismaTransactionClient = Prisma.TransactionClient;

// ════════════════════════════════════════════════════════════════════════════
// SINGLETON DE MÓDULO (Vercel / Node serverless)
// ────────────────────────────────────────────────────────────────────────────
// Este era antes un cliente por-request (cache() + Proxy) porque en Cloudflare
// Workers un socket TCP pertenece al request que lo abrió: cachearlo a nivel de
// módulo hacía que otro request reusara el socket → el runtime lo prohibía
// ("Cannot perform I/O on behalf of a different request").
//
// En Vercel (funciones Node serverless / Fluid Compute) esa restricción no
// existe: una instancia tibia se reusa de forma segura entre invocaciones
// (secuenciales o concurrentes — `pg.Pool` está diseñado justo para eso), así
// que el patrón estándar de Prisma para Next.js aplica sin modificaciones:
// un singleton cacheado en `globalThis` (evita duplicar clientes en cada
// hot-reload de `next dev`).
// ════════════════════════════════════════════════════════════════════════════

function resolveConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida");
  // El driver `pg` no entiende params solo-Prisma como `pgbouncer`; los quitamos.
  return url.replace("?pgbouncer=true", "");
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: resolveConnectionString() });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
