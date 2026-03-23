"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { deleteMediaFileByUrl, uploadMediaFile } from "@/lib/supabase/admin-storage";

type ToolPlan = "free" | "freemium" | "paid" | "edu_free";
type ToolLevel = "beginner" | "intermediate" | "advanced" | "all";
type ToolStatus = "draft" | "scheduled" | "published" | "archived";

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

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  const digest = typeof e.digest === "string" ? e.digest : "";
  return digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND");
}

function getCareerIds(formData: FormData) {
  return Array.from(
    new Set(
      formData
        .getAll("career_ids")
        .map((value) => value.toString().trim())
        .filter(Boolean),
    ),
  );
}

async function syncToolCareers(
  supabase: Awaited<ReturnType<typeof getSupabaseServerAuthClient>>,
  toolId: string,
  careerIds: string[],
) {
  const { error: deleteError } = await supabase.from("tool_careers").delete().eq("tool_id", toolId);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (!careerIds.length) {
    return;
  }

  const payload = careerIds.map((careerPathId, index) => ({
    tool_id: toolId,
    career_path_id: careerPathId,
    sort_order: index,
  }));

  const { error: insertError } = await supabase.from("tool_careers").insert(payload);
  if (insertError) {
    throw new Error(insertError.message);
  }
}

export async function createToolAction(formData: FormData) {
  try {
    await ensureStaffUser();
    const supabase = await getSupabaseServerAuthClient();

    const name = (formData.get("name")?.toString() ?? "").trim();
    const providedSlug = (formData.get("slug")?.toString() ?? "").trim();
    const slug = slugify(providedSlug || name);
    const description = normalizeNullableText(formData.get("description"));
    const rawUrl = (formData.get("url")?.toString() ?? "").trim();
    const url = normalizeUrl(rawUrl);
    const plan = (formData.get("plan")?.toString() ?? "free") as ToolPlan;
    const level = (formData.get("level")?.toString() ?? "all") as ToolLevel;
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const careerIds = getCareerIds(formData);
    const status = (formData.get("status")?.toString() ?? "published") as ToolStatus;
    const sortOrder = Number.parseInt(formData.get("sort_order")?.toString() ?? "0", 10) || 0;

    if (!name || !slug || !url || careerIds.length === 0) {
      redirect("/admin/tools?err=Completa%20nombre%2C%20slug%2C%20url%20y%20al%20menos%20una%20carrera");
    }

    let coverImageUrl = normalizeNullableText(formData.get("cover_image_url"));
    const fileInput = formData.get("cover_image_file");
    let uploadedReplacementUrl: string | null = null;
    if (fileInput instanceof File && fileInput.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(fileInput, "tools");
      if (uploadErr) {
        redirect(`/admin/tools?err=${encodeURIComponent("Error subiendo imagen: " + uploadErr)}`);
      }
      uploadedReplacementUrl = uploadedUrl;
      coverImageUrl = uploadedUrl;
    }

    const { data: insertedTool, error } = await supabase
      .from("tools")
      .insert({
        name,
        slug,
        description,
        url,
        ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
        plan,
        level,
        ia_type: iaType,
        verified: formData.get("verified") === "on",
        edu_verified: formData.get("edu_verified") === "on",
        featured: formData.get("featured") === "on",
        status,
        sort_order: sortOrder,
      })
      .select("id")
      .single();

    if (error) {
      if (uploadedReplacementUrl) {
        await deleteMediaFileByUrl(uploadedReplacementUrl);
      }
      redirect(`/admin/tools?err=${encodeURIComponent(error.message)}`);
    }

    await syncToolCareers(supabase, insertedTool.id, careerIds);

    revalidatePath("/areas");
    revalidatePath("/estudiantes");
    revalidatePath("/herramientas/[slug]");
    revalidatePath("/admin/tools");
    redirect("/admin/tools?ok=Tool%20creada%20correctamente");
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/tools?err=No%20fue%20posible%20crear%20la%20tool");
  }
}

export async function deleteToolAction(formData: FormData) {
  try {
    await ensureStaffUser();
    const supabase = await getSupabaseServerAuthClient();

    const id = (formData.get("id")?.toString() ?? "").trim();

    if (!id) {
      redirect("/admin/tools?err=ID%20de%20tool%20requerido");
    }

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("cover_image_url")
      .eq("id", id)
      .maybeSingle();

    if (existingToolError) {
      redirect(`/admin/tools?err=${encodeURIComponent(existingToolError.message)}`);
    }

    const { error: postToolsError } = await supabase.from("post_tools").delete().eq("tool_id", id);
    if (postToolsError) {
      redirect(`/admin/tools?err=${encodeURIComponent("Error eliminando relaciones: " + postToolsError.message)}`);
    }

    const { error: toolCareersError } = await supabase.from("tool_careers").delete().eq("tool_id", id);
    if (toolCareersError) {
      redirect(`/admin/tools?err=${encodeURIComponent("Error eliminando carreras: " + toolCareersError.message)}`);
    }

    const { error } = await supabase.from("tools").delete().eq("id", id);
    if (error) {
      redirect(`/admin/tools?err=${encodeURIComponent(error.message)}`);
    }

    const { error: deleteMediaError } = await deleteMediaFileByUrl(existingTool?.cover_image_url);
    if (deleteMediaError) {
      console.error("Failed to delete tool media after record deletion", {
        toolId: id,
        deleteMediaError,
      });
    }

    revalidatePath("/areas");
    revalidatePath("/estudiantes");
    revalidatePath("/herramientas/[slug]");
    revalidatePath("/admin/tools");
    revalidatePath("/admin/relations");
    redirect("/admin/tools?ok=Tool%20eliminada%20correctamente");
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/tools?err=No%20fue%20posible%20eliminar%20la%20tool");
  }
}

export async function updateToolAction(formData: FormData) {
  try {
    await ensureStaffUser();
    const supabase = await getSupabaseServerAuthClient();

    const id = (formData.get("id")?.toString() ?? "").trim();
    const name = (formData.get("name")?.toString() ?? "").trim();
    const providedSlug = (formData.get("slug")?.toString() ?? "").trim();
    const slug = slugify(providedSlug || name);
    const description = normalizeNullableText(formData.get("description"));
    const rawUrl = (formData.get("url")?.toString() ?? "").trim();
    const url = normalizeUrl(rawUrl);
    const plan = (formData.get("plan")?.toString() ?? "free") as ToolPlan;
    const level = (formData.get("level")?.toString() ?? "all") as ToolLevel;
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const careerIds = getCareerIds(formData);
    const status = (formData.get("status")?.toString() ?? "published") as ToolStatus;
    const sortOrder = Number.parseInt(formData.get("sort_order")?.toString() ?? "0", 10) || 0;

    if (!id || !name || !slug || !url || careerIds.length === 0) {
      redirect("/admin/tools?err=Faltan%20datos%20obligatorios%20para%20actualizar");
    }

    let coverImageUrl = normalizeNullableText(formData.get("cover_image_url"));
    const fileInput = formData.get("cover_image_file");
    let uploadedReplacementUrl: string | null = null;

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("cover_image_url")
      .eq("id", id)
      .maybeSingle();

    if (existingToolError) {
      redirect(`/admin/tools?err=${encodeURIComponent(existingToolError.message)}`);
    }

    const previousCoverImageUrl = existingTool?.cover_image_url ?? null;
    if (fileInput instanceof File && fileInput.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(fileInput, "tools");
      if (uploadErr) {
        redirect(`/admin/tools?err=${encodeURIComponent("Error subiendo imagen: " + uploadErr)}`);
      }
      uploadedReplacementUrl = uploadedUrl;
      coverImageUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("tools")
      .update({
        name,
        slug,
        description,
        url,
        ...(coverImageUrl !== undefined ? { cover_image_url: coverImageUrl } : {}),
        plan,
        level,
        ia_type: iaType,
        verified: formData.get("verified") === "on",
        edu_verified: formData.get("edu_verified") === "on",
        featured: formData.get("featured") === "on",
        status,
        sort_order: sortOrder,
      })
      .eq("id", id);

    if (error) {
      if (uploadedReplacementUrl) {
        await deleteMediaFileByUrl(uploadedReplacementUrl);
      }
      redirect(`/admin/tools?err=${encodeURIComponent(error.message)}`);
    }

    const coverChanged = previousCoverImageUrl && previousCoverImageUrl !== coverImageUrl;
    if (coverChanged) {
      const { error: deleteMediaError } = await deleteMediaFileByUrl(previousCoverImageUrl);
      if (deleteMediaError) {
        console.error("Failed to delete replaced tool media", {
          toolId: id,
          previousCoverImageUrl,
          deleteMediaError,
        });
      }
    }

    await syncToolCareers(supabase, id, careerIds);

    revalidatePath("/areas");
    revalidatePath("/estudiantes");
    revalidatePath("/herramientas/[slug]");
    revalidatePath("/admin/tools");
    redirect("/admin/tools?ok=Tool%20actualizada%20correctamente");
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/tools?err=No%20fue%20posible%20actualizar%20la%20tool");
  }
}
