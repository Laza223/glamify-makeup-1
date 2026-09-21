# Bitácora

Una línea por cierre de sesión, escrita sola por el hook de cierre.
Solo historia — lo que se hizo, que no caduca. Lo vigente vive en `.claude/ESTADO.md`;
lo que está abierto se consulta en los PRs y el CI, no se escribe acá.

- **2026-08-27 21:26** `docs-auditoria-pre-lanzamiento` — 6 bugs de código cerrados (guard de entorno + su propio bug de `.env`, timeout MP + mensaje en español, try/catch email webhook, checkbox de T&C verificado end-to-end, bug de hidratación en breadcrumbs); juez completo verde (typecheck, lint, 465 tests, build); decisión y gotchas documentados
- **2026-08-27 21:28** `docs-auditoria-pre-lanzamiento` — commit + push de los 6 fixes + auditoría completa; árbol limpio
- **2026-08-27 21:50** `main` — merge + push a main completo, código verificado
- **2026-08-27 21:55** `main` — reintenté, mismo error exacto: "your account is locked due to a billing issue" — no se resolvió del lado de GitHub
- **2026-08-27 21:58** `main` — causa real confirmada con tu sesión real de GitHub (captura del banner de billing): autorización de tarjeta fallida, no es tema de repo público/privado
- **2026-08-28 23:18** `main` — primera compra real de punta a punta verificada: pago, webhook, auto-import a MiCorreo, reembolso manual — todo funcionó
- **2026-09-03 04:49** `main` — feature completo + fixes de estabilidad, revisado por verificador adversarial con contexto fresco (3 hallazgos reales, los 3 corregidos) — `pnpm lint`/`typecheck`/`test` en verde (477 tests)
- **2026-09-03 04:53** `main` — armé `scripts/seed-gift-categories.ts` (`pnpm categories:seed-gift`), idempotente, mismo patrón que `prisma/seed.ts` — crea las 4 categorías con `showInMenu` apagado
- **2026-09-03 05:12** `main` — migración aplicada (`20260903050907_add_product_category_and_show_in_menu`) + 4 categorías de regalo creadas en DB, verificado en vivo en el navegador (storefront) + 477 tests + lint + typecheck en verde
- **2026-09-12 15:04** `chore/migrate-deploy-vercel` — rama sincronizada con lo último de `main`, PR abierto, bug de arranque de Prisma encontrado y arreglado (confirmado con build local), CI + preview de Vercel corriendo de nuevo (verificalo vos en el link del PR o esperá que te avise Auto-fix)
- **2026-09-12 15:10** `chore/migrate-deploy-vercel` — 2 bugs reales de la migración encontrados vía logs de Vercel y arreglados: singleton de Prisma eager (rompía build) y `appBaseUrl()` con `??` que no cubría string vacío (rompía `/_not-found` con "Invalid URL"). Ambos confirmados con build local antes de pushear. `typecheck`/`test` en verde (477 tests) en los dos commits.
- **2026-09-12 16:17** `chore/migrate-deploy-vercel` — verificado en vivo (no solo build verde): homepage, categorías e imágenes cargan con datos reales de la DB, consola sin errores
- **2026-09-13 04:42** `chore/migrate-deploy-vercel` — variables recargadas (13 OK, `NEXT_PUBLIC_APP_URL` = vercel.app); causa del rechazo confirmada vía API de MP: token de cuenta de prueba, error mío al priorizar `.env.local`
- **2026-09-13 05:13** `chore/migrate-deploy-vercel` — checkout MP real + webhook + import automático a MiCorreo funcionan en Vercel; bug de datos de envío diagnosticado (anterior a la migración)
- **2026-09-13 05:20** `fix/micorreo-datos-envio` — teléfono y piso/depto corregidos con tests nuevos: lint OK, typecheck OK, 481/481 tests. `prettier --check` falla en esos 4 archivos, pero fallaba igual en `main` antes del cambio (CRLF de todo el repo)
- **2026-09-13 05:29** `fix/micorreo-datos-envio` — commit `708e4f6` pusheado con el fix de teléfono y piso/depto (solo los 4 archivos del fix)
- **2026-09-13 05:35** `fix/micorreo-datos-envio` — causa de los mails confirmada con la API de Resend: la cuenta no tiene dominio verificado · checklist viejo actualizado
- **2026-09-13 05:45** `fix/micorreo-datos-envio` — causa confirmada en logs de Vercel: `Resend falló: 422 "The domain is invalid"` en GLM-000015 y GLM-000016 · dominio `glamifymakeup.site` creado en Resend (cuenta gglamifymakeup, São Paulo) · `RESEND_FROM` en Vercel = `Glamify Makeup <hola@glamifymakeup.site>`
- **2026-09-13 17:06** `fix/micorreo-datos-envio` — dominio verificado en Resend, redeploy en Vercel con remitente nuevo
- **2026-09-13 17:18** `fix/micorreo-datos-envio` — registro DMARC (`_dmarc` → `v=DMARC1; p=none;`) cargado en Cloudflare
