"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { deleteMediaFileByUrl, uploadMediaFile } from "@/lib/supabase/admin-storage";
import {
  collectPostContentImageUrls,
  markdownToPostContentBlocks,
  normalizePostContentBlocks,
  type PostKind,
  type PostStatus,
} from "@/lib/types/post";

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

function parseStructuredContent(formData: FormData, fallbackMarkdown: string) {
  const rawContentJson = normalizeNullableText(formData.get("content_json"));
  if (rawContentJson) {
    try {
      return normalizePostContentBlocks(JSON.parse(rawContentJson));
    } catch {
      // Fall back to markdown parsing below.
    }
  }

  return markdownToPostContentBlocks(fallbackMarkdown);
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
    const subtitle = normalizeNullableText(formData.get("subtitle"));
    const excerpt = normalizeNullableText(formData.get("excerpt"));
    const content = (formData.get("content_md")?.toString() ?? "").trim();
    const contentJson = parseStructuredContent(formData, content);
    const hasStructuredContent = contentJson.length > 0;
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const postKind = (formData.get("post_kind")?.toString() ?? "blog") as PostKind;
    const status = (formData.get("status")?.toString() ?? "draft") as PostStatus;
    const publishedInput = normalizeNullableText(formData.get("published_at"));
    const heroImageAlt = normalizeNullableText(formData.get("hero_image_alt"));
    const heroImageCaption = normalizeNullableText(formData.get("hero_image_caption"));

    if (!title || !slug || !postKind || !status || !publishedInput || !hasStructuredContent) {
      redirect("/admin/posts/new?err=Completa%20titulo%2C%20slug%2C%20tipo%20de%20post%2C%20estado%2C%20fecha%20y%20contenido");
    }

    let coverImage = normalizeNullableText(formData.get("cover_image_url"));
    const fileInput = formData.get("cover_image_file");
    let uploadedReplacementUrl: string | null = null;
    if (fileInput instanceof File && fileInput.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(fileInput, "posts");
      if (uploadErr) {
        redirect(`/admin/posts/new?err=${encodeURIComponent("Error subiendo imagen: " + uploadErr)}`);
      }
      uploadedReplacementUrl = uploadedUrl;
      coverImage = uploadedUrl;
    }

    const publishedAt =
      status === "published"
        ? (publishedInput ? new Date(publishedInput).toISOString() : new Date().toISOString())
        : publishedInput
          ? new Date(publishedInput).toISOString()
          : null;

    const { data: insertedPost, error } = await supabase
      .from("posts")
      .insert({
        title,
        slug,
        subtitle,
        excerpt,
        content_md: content,
        content_json: contentJson,
        cover_image_url: coverImage,
        hero_image_alt: heroImageAlt,
        hero_image_caption: heroImageCaption,
        post_kind: postKind,
        ia_type: iaType,
        status,
        published_at: publishedAt,
        author_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      if (uploadedReplacementUrl) {
        await deleteMediaFileByUrl(uploadedReplacementUrl);
      }
      redirect(`/admin/posts/new?err=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    redirect(`/admin/posts/${insertedPost.id}/edit?ok=Post%20creado%20correctamente`);
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/posts/new?err=No%20fue%20posible%20crear%20el%20post");
  }
}

export async function deletePostAction(formData: FormData) {
  try {
    await ensureStaffUser();
    const supabase = await getSupabaseServerAuthClient();

    const id = (formData.get("id")?.toString() ?? "").trim();

    if (!id) {
      redirect("/admin/posts?err=ID%20de%20post%20requerido");
    }

    const { data: existingPost, error: existingPostError } = await supabase
      .from("posts")
      .select("cover_image_url, content_json")
      .eq("id", id)
      .maybeSingle();

    if (existingPostError) {
      redirect(`/admin/posts?err=${encodeURIComponent(existingPostError.message)}`);
    }

    // 1. Eliminar primero las relaciones en post_tools (integridad referencial)
    const { error: relError } = await supabase
      .from("post_tools")
      .delete()
      .eq("post_id", id);

    if (relError) {
      redirect(`/admin/posts?err=${encodeURIComponent("Error eliminando relaciones: " + relError.message)}`);
    }

    // 2. Eliminar el post
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      redirect(`/admin/posts?err=${encodeURIComponent(error.message)}`);
    }

    const { error: deleteMediaError } = await deleteMediaFileByUrl(existingPost?.cover_image_url);
    if (deleteMediaError) {
      console.error("Failed to delete post media after record deletion", {
        postId: id,
        deleteMediaError,
      });
    }

    const existingContentImages = collectPostContentImageUrls(
      normalizePostContentBlocks(existingPost?.content_json ?? []),
    );
    for (const imageUrl of existingContentImages) {
      const { error: inlineDeleteError } = await deleteMediaFileByUrl(imageUrl);
      if (inlineDeleteError) {
        console.error("Failed to delete post inline media after record deletion", {
          postId: id,
          imageUrl,
          inlineDeleteError,
        });
      }
    }

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]");
    revalidatePath("/admin/posts");
    revalidatePath("/admin/relations");
    redirect("/admin/posts?ok=Post%20eliminado%20correctamente");
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/posts?err=No%20fue%20posible%20eliminar%20el%20post");
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
    const subtitle = normalizeNullableText(formData.get("subtitle"));
    const excerpt = normalizeNullableText(formData.get("excerpt"));
    const content = (formData.get("content_md")?.toString() ?? "").trim();
    const contentJson = parseStructuredContent(formData, content);
    const hasStructuredContent = contentJson.length > 0;
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const postKind = (formData.get("post_kind")?.toString() ?? "blog") as PostKind;
    const status = (formData.get("status")?.toString() ?? "draft") as PostStatus;
    const publishedInput = normalizeNullableText(formData.get("published_at"));
    const heroImageAlt = normalizeNullableText(formData.get("hero_image_alt"));
    const heroImageCaption = normalizeNullableText(formData.get("hero_image_caption"));

    if (!id || !title || !slug || !postKind || !status || !publishedInput || !hasStructuredContent) {
      redirect(`/admin/posts/${id}/edit?err=Faltan%20titulo%2C%20slug%2C%20tipo%20de%20post%2C%20estado%2C%20fecha%20o%20contenido`);
    }

    let coverImage = normalizeNullableText(formData.get("cover_image_url"));
    const fileInput = formData.get("cover_image_file");
    let uploadedReplacementUrl: string | null = null;

    const { data: existingPost, error: existingPostError } = await supabase
      .from("posts")
      .select("cover_image_url, content_json")
      .eq("id", id)
      .maybeSingle();

    if (existingPostError) {
      redirect(`/admin/posts/${id}/edit?err=${encodeURIComponent(existingPostError.message)}`);
    }

    if (fileInput instanceof File && fileInput.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(fileInput, "posts");
      if (uploadErr) {
        redirect(`/admin/posts/${id}/edit?err=${encodeURIComponent("Error subiendo imagen: " + uploadErr)}`);
      }
      uploadedReplacementUrl = uploadedUrl;
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
        subtitle,
        excerpt,
        content_md: content,
        content_json: contentJson,
        cover_image_url: coverImage,
        hero_image_alt: heroImageAlt,
        hero_image_caption: heroImageCaption,
        post_kind: postKind,
        ia_type: iaType,
        status,
        published_at: publishedAt,
      })
      .eq("id", id);

    if (error) {
      if (uploadedReplacementUrl) {
        await deleteMediaFileByUrl(uploadedReplacementUrl);
      }
      redirect(`/admin/posts/${id}/edit?err=${encodeURIComponent(error.message)}`);
    }

    const previousImageUrls = new Set(
      collectPostContentImageUrls(normalizePostContentBlocks(existingPost?.content_json ?? [])),
    );
    const currentImageUrls = new Set(collectPostContentImageUrls(contentJson));

    for (const previousUrl of previousImageUrls) {
      if (currentImageUrls.has(previousUrl)) continue;
      const { error: deleteInlineError } = await deleteMediaFileByUrl(previousUrl);
      if (deleteInlineError) {
        console.error("Failed to delete removed inline image", {
          postId: id,
          previousUrl,
          deleteInlineError,
        });
      }
    }

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]");
    revalidatePath("/admin/posts");
    redirect(`/admin/posts/${id}/edit?ok=Post%20actualizado%20correctamente`);
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect(`/admin/posts/${(formData.get("id")?.toString() ?? "").trim()}/edit?err=No%20fue%20posible%20actualizar%20el%20post`);
  }
}
