"use server";

import { revalidatePath } from "next/cache";
import { getCustomer } from "@/lib/customer/auth";
import { createReview } from "@/lib/reviews/service";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/admin/products/images";
import type { ActionResult } from "@/lib/forms/action-result";

export interface ReviewActionResult extends ActionResult {
  status?: string;
}

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_BYTES = 5 * 1024 * 1024;

export async function createReviewAction(
  inputOrFormData:
    | FormData
    | {
        productId: string;
        slug: string;
        rating: number;
        title: string;
        body: string;
        authorName?: string;
        website?: string;
        photoUrl?: string | null;
      },
): Promise<ReviewActionResult> {
  let productId = "";
  let slug = "";
  let rating = 0;
  let title = "";
  let body = "";
  let authorName: string | undefined;
  let website: string | undefined;
  let photoUrl: string | null = null;

  if (inputOrFormData instanceof FormData) {
    website = String(inputOrFormData.get("website") ?? "");
    productId = String(inputOrFormData.get("productId") ?? "");
    slug = String(inputOrFormData.get("slug") ?? "");
    rating = Number(inputOrFormData.get("rating") ?? 0);
    title = String(inputOrFormData.get("title") ?? "");
    body = String(inputOrFormData.get("body") ?? "");
    authorName =
      String(inputOrFormData.get("authorName") ?? "").trim() || undefined;

    const photoFile = inputOrFormData.get("photo") as File | null;
    if (photoFile && photoFile.size > 0 && photoFile.name) {
      if (!ALLOWED_MIME.includes(photoFile.type)) {
        return {
          ok: false,
          error: "Formato de foto no permitido. Subí PNG, JPG o WEBP.",
        };
      }
      if (photoFile.size > MAX_BYTES) {
        return { ok: false, error: "La foto no puede superar los 5 MB." };
      }

      const ext =
        photoFile.type.split("/")[1] === "jpeg"
          ? "jpg"
          : photoFile.type.split("/")[1] || "jpg";
      const path = `reviews/${crypto.randomUUID()}.${ext}`;

      const supabase = createAdminClient();
      const { error } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, photoFile, {
          contentType: photoFile.type,
          upsert: false,
        });

      if (error) {
        return { ok: false, error: `Error al subir la foto: ${error.message}` };
      }
      photoUrl = path;
    }
  } else {
    productId = inputOrFormData.productId;
    slug = inputOrFormData.slug;
    rating = Number(inputOrFormData.rating);
    title = inputOrFormData.title;
    body = inputOrFormData.body;
    authorName = inputOrFormData.authorName;
    website = inputOrFormData.website;
    photoUrl = inputOrFormData.photoUrl ?? null;
  }

  // Bot: campo trampa completado → fingimos éxito sin crear nada.
  if (website && website.trim() !== "") return { ok: true, status: "pending" };

  const customer = await getCustomer();
  try {
    const res = await createReview(
      {
        customerId: customer?.id ?? null,
        authorName: customer
          ? (customer.name ?? customer.email)
          : (authorName ?? "").trim(),
        productId,
        rating,
        title,
        body,
        photoUrl,
      },
      { db: prisma as never },
    );
    revalidatePath(`/producto/${slug}`);
    return { ok: true, status: res.status };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "No se pudo enviar la reseña.",
    };
  }
}
