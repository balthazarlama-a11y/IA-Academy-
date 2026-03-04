/**
 * Admin Storage Helpers
 * Uploads files to the Supabase Storage "media" bucket.
 * Must be called only from Server Actions (has "use server" context).
 */

import { getSupabaseServerAuthClient } from "./server";

export type UploadResult =
  | { url: string; error: null }
  | { url: null; error: string };

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

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `${folder}/${uniqueId}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const supabase = await getSupabaseServerAuthClient();

    const { data, error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, buffer, {
        contentType: file.type,
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
