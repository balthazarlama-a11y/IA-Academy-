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

export type DeleteResult = { error: string | null };

const MEDIA_BUCKET = "media";
const COVER_WIDTH = 1440;
const COVER_HEIGHT = 810;
const COVER_BACKGROUND = { r: 248, g: 250, b: 252, alpha: 1 };
const TOOL_LOGO_SIZE = 720;
const TOOL_LOGO_BACKGROUND = { r: 255, g: 255, b: 255, alpha: 0 };

type UploadPreset = "cover" | "logo";

async function normalizeUploadImage(file: File, preset: UploadPreset) {
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  const processor = sharp(inputBuffer, {
    failOn: "warning",
    limitInputPixels: 40_000_000,
  }).rotate();

  const normalizedBuffer =
    preset === "logo"
      ? await processor
          .resize(TOOL_LOGO_SIZE, TOOL_LOGO_SIZE, {
            fit: "contain",
            background: TOOL_LOGO_BACKGROUND,
            withoutEnlargement: true,
          })
          .webp({ quality: 82, alphaQuality: 88, effort: 5 })
          .toBuffer()
      : await processor
          .resize(COVER_WIDTH, COVER_HEIGHT, {
            fit: "cover",
            position: "attention",
            background: COVER_BACKGROUND,
            withoutEnlargement: true,
          })
          .webp({ quality: 78, effort: 5 })
          .toBuffer();

  return {
    buffer: normalizedBuffer,
    contentType: "image/webp",
    extension: "webp",
  };
}

export async function uploadMediaFile(file: File, folder: "posts" | "tools" = "posts", preset?: UploadPreset): Promise<UploadResult> {
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
    const effectivePreset = preset ?? (folder === "tools" ? "logo" : "cover");
    const { buffer, contentType, extension } = await normalizeUploadImage(file, effectivePreset);
    const storagePath = `${folder}/${uniqueId}.${extension}`;

    const supabase = getSupabaseServiceRoleClient();

    const { data, error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
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
      .from(MEDIA_BUCKET)
      .getPublicUrl(data.path);

    return { url: publicData.publicUrl, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error inesperado al subir imagen";
    return { url: null, error: message };
  }
}

function getMediaStoragePathFromUrl(url: string | null | undefined) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const publicMarker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const signedMarker = `/storage/v1/object/sign/${MEDIA_BUCKET}/`;

    const marker = parsed.pathname.includes(publicMarker)
      ? publicMarker
      : parsed.pathname.includes(signedMarker)
        ? signedMarker
        : null;

    if (!marker) return null;

    const [, encodedPath = ""] = parsed.pathname.split(marker);
    const storagePath = decodeURIComponent(encodedPath).replace(/^\/+/, "");
    return storagePath || null;
  } catch {
    return null;
  }
}

export async function deleteMediaFileByUrl(url: string | null | undefined): Promise<DeleteResult> {
  const storagePath = getMediaStoragePathFromUrl(url);
  if (!storagePath) {
    return { error: null };
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);

    return { error: error?.message ?? null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "No fue posible borrar la imagen previa",
    };
  }
}
