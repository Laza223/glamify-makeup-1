import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export type PrismaTransactionClient = Prisma.TransactionClient;

// ════════════════════════════════════════════════════════════════════════════
// SINGLETON PEREZOSO DE MÓDULO (Vercel / Node serverless)
// ────────────────────────────────────────────────────────────────────────────
// Este era antes un cliente por-request (cache() + Proxy) porque en Cloudflare
// Workers un socket TCP pertenece al request que lo abrió: cachearlo a nivel de
// módulo hacía que otro request reusara el socket → el runtime lo prohibía
// ("Cannot perform I/O on behalf de un request distinto").
//
// En Vercel (funciones Node serverless / Fluid Compute) esa restricción no
// existe: una instancia tibia se reusa de forma segura entre invocaciones
// (secuenciales o concurrentes — `pg.Pool` está diseñado justo para eso).
//
// OJO: el singleton tiene que ser PEREZOSO (construirse recién en el primer
// uso real), no eager al importar el módulo. `next build` importa los Route
// Handlers para "Collecting page data" sin ejecutarlos — si el cliente se
// construye eager al importar y DATABASE_URL no está disponible en ese paso
// del build (pasó en Vercel: el build no siempre expone las mismas env vars
// que el runtime), el build entero explota con "DATABASE_URL no está
// definida" aunque ninguna ruta haya tocado la DB todavía. El Proxy de abajo
// solo resuelve el cliente real al primer acceso a una propiedad
// (`prisma.product`, `prisma.$transaction`, ...), que solo pasa en runtime.
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

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createPrismaClient();
  return globalForPrisma.prisma;
}

/**
 * Shim de compatibilidad: mantiene `import { prisma } from "@/lib/prisma"` en
 * los ~50 call sites existentes. Cada acceso a una propiedad resuelve (y
 * cachea) el singleton real de forma perezosa vía `getDb()`.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
