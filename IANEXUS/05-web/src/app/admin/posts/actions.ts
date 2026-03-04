"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { uploadMediaFile } from "@/lib/supabase/admin-storage";

type PostKind = "blog" | "tool" | "guide" | "news";
type PostStatus = "draft" | "scheduled" | "published" | "archived";

async function ensureStaffUser() {
  const user = await getCurrentUser();
  const role = user?.role ?? null;
  if (!user || (role !== "admin" && role !== "master")) {
    throw new Error("No autorizado");
  }
  return user;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeNullableText(value: FormDataEntryValue | null) {
  const normalized = (typeof value === "string" ? value : "").trim();
  return normalized.length > 0 ? normalized : null;
}

function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  const digest = typeof e.digest === "string" ? e.digest : "";
  return digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND");
}

export async function createPostAction(formData: FormData) {
  try {
    const user = await ensureStaffUser();
    const supabase = await getSupabaseServerAuthClient();

    const title = (formData.get("title")?.toString() ?? "").trim();
    const providedSlug = (formData.get("slug")?.toString() ?? "").trim();
    const slug = slugify(providedSlug || title);
    const excerpt = normalizeNullableText(formData.get("excerpt"));
    const content = (formData.get("content_md")?.toString() ?? "").trim();
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const postKind = (formData.get("post_kind")?.toString() ?? "blog") as PostKind;
    const status = (formData.get("status")?.toString() ?? "draft") as PostStatus;
    const publishedInput = normalizeNullableText(formData.get("published_at"));

    if (!title || !slug || !content) {
      redirect("/admin/posts?err=Completa%20titulo%2C%20slug%20y%20contenido");
    }

    let coverImage = normalizeNullableText(formData.get("cover_image_url"));
    const fileInput = formData.get("cover_image_file");
    if (fileInput instanceof File && fileInput.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(fileInput, "posts");
      if (uploadErr) {
        redirect(`/admin/posts?err=${encodeURIComponent("Error subiendo imagen: " + uploadErr)}`);
      }
      coverImage = uploadedUrl;
    }

    const publishedAt =
      status === "published"
        ? (publishedInput ? new Date(publishedInput).toISOString() : new Date().toISOString())
        : publishedInput
          ? new Date(publishedInput).toISOString()
          : null;

    const { error } = await supabase.from("posts").insert({
      title,
      slug,
      excerpt,
      content_md: content,
      cover_image_url: coverImage,
      post_kind: postKind,
      ia_type: iaType,
      status,
      published_at: publishedAt,
      author_id: user.id,
    });

    if (error) {
      redirect(`/admin/posts?err=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    redirect("/admin/posts?ok=Post%20creado%20correctamente");
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/posts?err=No%20fue%20posible%20crear%20el%20post");
  }
}

export async function updatePostAction(formData: FormData) {
  try {
    await ensureStaffUser();
    const supabase = await getSupabaseServerAuthClient();

    const id = (formData.get("id")?.toString() ?? "").trim();
    const title = (formData.get("title")?.toString() ?? "").trim();
    const providedSlug = (formData.get("slug")?.toString() ?? "").trim();
    const slug = slugify(providedSlug || title);
    const excerpt = normalizeNullableText(formData.get("excerpt"));
    const content = (formData.get("content_md")?.toString() ?? "").trim();
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const postKind = (formData.get("post_kind")?.toString() ?? "blog") as PostKind;
    const status = (formData.get("status")?.toString() ?? "draft") as PostStatus;
    const publishedInput = normalizeNullableText(formData.get("published_at"));

    if (!id || !title || !slug || !content) {
      redirect("/admin/posts?err=Faltan%20datos%20obligatorios%20para%20actualizar");
    }

    let coverImage = normalizeNullableText(formData.get("cover_image_url"));
    const fileInput = formData.get("cover_image_file");
    if (fileInput instanceof File && fileInput.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(fileInput, "posts");
      if (uploadErr) {
        redirect(`/admin/posts?err=${encodeURIComponent("Error subiendo imagen: " + uploadErr)}`);
      }
      coverImage = uploadedUrl;
    }

    const publishedAt =
      status === "published"
        ? (publishedInput ? new Date(publishedInput).toISOString() : new Date().toISOString())
        : publishedInput
          ? new Date(publishedInput).toISOString()
          : null;

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        excerpt,
        content_md: content,
        cover_image_url: coverImage,
        post_kind: postKind,
        ia_type: iaType,
        status,
        published_at: publishedAt,
      })
      .eq("id", id);

    if (error) {
      redirect(`/admin/posts?err=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]");
    revalidatePath("/admin/posts");
    redirect("/admin/posts?ok=Post%20actualizado%20correctamente");
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/posts?err=No%20fue%20posible%20actualizar%20el%20post");
  }
}
