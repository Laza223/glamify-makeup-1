import { prisma } from "@/lib/prisma";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppFabButton } from "@/components/layout/whatsapp-fab-button";

/** Botón flotante de WhatsApp (blueprint 02 §6). No renderiza si no hay número en Setting. */
export async function WhatsAppFab() {
  const setting = await prisma.setting.findUnique({
    where: { id: "default" },
    select: { whatsappNumber: true },
  });
  const href = whatsappLink(setting?.whatsappNumber);
  if (!href) return null;

  return <WhatsAppFabButton href={href} />;
}
