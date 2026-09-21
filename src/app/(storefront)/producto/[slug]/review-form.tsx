"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RatingInput } from "@/components/ui/rating-stars";
import { track } from "@/lib/analytics/track";
import { createReviewAction } from "./review-actions";

export function ReviewForm({ productId, slug, isLoggedIn }: { productId: string; slug: string; isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneStatus, setDoneStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await createReviewAction({
      productId,
      slug,
      rating: Number(fd.get("rating") ?? 0),
      title: String(fd.get("title") ?? ""),
      body: String(fd.get("body") ?? ""),
      authorName: isLoggedIn ? undefined : String(fd.get("authorName") ?? ""),
      website: String(fd.get("website") ?? ""),
    });
    setPending(false);
    if (res.ok) {
      setDoneStatus(res.status ?? "pending");
      track("review_submitted", { status: res.status });
    } else {
      setError(res.error ?? "Error");
    }
  }

  if (doneStatus) {
    return (
      <p className="text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl p-3">
        {doneStatus === "approved"
          ? "¡Muchas gracias por tu reseña! Ya está publicada."
          : "¡Muchas gracias por tu reseña! Se publicará tras la moderación."}
      </p>
    );
  }

  if (!isOpen) {
    return (
      <div className="pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="rounded-full text-xs font-semibold gap-1.5 hover:bg-secondary hover:text-primary"
        >
          <PenLine className="size-3.5" />
          <span>Escribir reseña</span>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border p-4 bg-white/90 animate-fade-up">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Tu opinión sobre este producto</p>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
      <RatingInput name="rating" />
      {!isLoggedIn && (
        <div className="space-y-1">
          <Label htmlFor="rname">Tu nombre</Label>
          <Input id="rname" name="authorName" required minLength={2} maxLength={60} autoComplete="name" />
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor="rtitle">Título (opcional)</Label>
        <Input id="rtitle" name="title" maxLength={120} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="rbody">Tu experiencia</Label>
        <Textarea id="rbody" name="body" required maxLength={2000} rows={3} />
      </div>
      {/* Honeypot anti-spam: oculto para humanos, los bots tienden a completarlo. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {!isLoggedIn && (
        <p className="text-xs text-muted-foreground">Tu reseña se publica tras la revisión de la dueña.</p>
      )}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Enviando…" : "Publicar reseña"}</Button>
    </form>
  );
}
