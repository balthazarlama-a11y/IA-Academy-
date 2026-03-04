"use server";

import { getCurrentUser } from "@/lib/auth/session";
import { uploadMediaFile } from "@/lib/supabase/admin-storage";

/**
 * Server Action callable from Client Components.
 * Receives a FormData with "file" (File) and "folder" ("posts"|"tools").
 * Returns the public URL on success, or an error string.
 */
export async function uploadImageAction(
  formData: FormData,
): Promise<{ url: string | null; error: string | null }> {
  const user = await getCurrentUser();
  const role = user?.role ?? null;
  if (!user || (role !== "admin" && role !== "master")) {
    return { url: null, error: "No autorizado" };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { url: null, error: "No se recibió archivo" };
  }

  const folderRaw = formData.get("folder")?.toString() ?? "posts";
  const folder = (folderRaw === "tools" ? "tools" : "posts") as "posts" | "tools";

  return uploadMediaFile(file, folder);
}
