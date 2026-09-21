"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function WhatsAppFabButton({ href }: { href: string }) {
  const pathname = usePathname();

  // Ocultar en PDP (donde está la sticky buy bar en mobile) y en checkout (para no tapar inputs ni botones)
  if (pathname.startsWith("/checkout") || pathname.startsWith("/producto/")) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none md:bottom-6"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}
