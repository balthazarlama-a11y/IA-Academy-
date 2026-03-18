/**
 * Admin Storage Helpers
 * Uploads files to the Supabase Storage "media" bucket.
 * Must be called only from Server Actions after validating admin/master access.
 */

import sharp from "sharp";
import { getSupabaseServiceRoleClient } from "./server";

export type UploadResult =
  | { url: string; error: null }
  | { url: null; error: string };

const COVER_WIDTH = 1600;
const COVER_HEIGHT = 900;
const COVER_BACKGROUND = { r: 248, g: 250, b: 252, alpha: 1 };

async function normalizeCoverImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  const normalizedBuffer = await sharp(inputBuffer, {
    failOn: "warning",
    limitInputPixels: 40_000_000,
  })
    .rotate()
    .resize(COVER_WIDTH, COVER_HEIGHT, {
      fit: "contain",
      background: COVER_BACKGROUND,
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();

  return {
    buffer: normalizedBuffer,
    contentType: "image/webp",
    extension: "webp",
  };
}

/**
 * Uploads a File (from FormData) to the "media" bucket.
 * Returns the public URL on success, or an error string on failure.
 */
export async function uploadMediaFile(
  file: File,
  folder: "posts" | "tools" = "posts"
): Promise<UploadResult> {
  try {
    if (!file || file.size === 0) {
      return { url: null, error: "El archivo está vacío" };
    }

    const maxMb = 5;
    if (file.size > maxMb * 1024 * 1024) {
      return { url: null, error: `La imagen no puede superar ${maxMb} MB` };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return {
        url: null,
        error: `Formato no permitido: ${file.type}. Usa JPG, PNG, WEBP, GIF o AVIF`,
      };
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const { buffer, contentType, extension } = await normalizeCoverImage(file);
    const storagePath = `${folder}/${uniqueId}.${extension}`;

    const supabase = getSupabaseServiceRoleClient();

    const { data, error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, buffer, {
        contentType,
        upsert: false,
        cacheControl: "31536000",
      });

    if (uploadError || !data?.path) {
      return {
        url: null,
        error: uploadError?.message ?? "Error desconocido al subir la imagen",
      };
    }

    const { data: publicData } = supabase.storage
      .from("media")
      .getPublicUrl(data.path);

    return { url: publicData.publicUrl, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error inesperado al subir imagen";
    return { url: null, error: message };
  }
}
