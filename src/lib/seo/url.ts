/** Base pública de la app (back_urls, OG, sitemap). */
export function appBaseUrl(): string {
  // `||` (no `??`): una env var vacía ("") en la plataforma de deploy debe caer
  // al default igual que si no estuviera definida — `new URL("")` explota
  // ("Invalid URL") y rompe el build entero (pasó de verdad en un preview de
  // Vercel con NEXT_PUBLIC_APP_URL en blanco).
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/** Convierte un path relativo en URL absoluta; deja pasar las que ya son http(s). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, appBaseUrl()).toString();
}
