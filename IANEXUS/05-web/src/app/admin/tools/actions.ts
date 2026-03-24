"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { deleteMediaFileByUrl, uploadMediaFile } from "@/lib/supabase/admin-storage";

type ToolPlan = "free" | "freemium" | "paid" | "edu_free";
type ToolLevel = "beginner" | "intermediate" | "advanced" | "all";
type ToolStatus = "draft" | "scheduled" | "published" | "archived";

type FaqItem = { question: string; answer: string };

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

function getDistinctIds(formData: FormData, key: string) {
  return Array.from(new Set(formData.getAll(key).map((value) => value.toString().trim()).filter(Boolean)));
}

function parseListField(formData: FormData, key: string) {
  return Array.from(
    new Set(
      (formData.get(key)?.toString() ?? "")
        .split(/\r?\n|,/)
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function parseFaqItems(formData: FormData): FaqItem[] {
  return (formData.get("faq_items")?.toString() ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...answerParts] = line.split("|");
      return {
        question: question?.trim() ?? "",
        answer: answerParts.join("|").trim(),
      };
    })
    .filter((item) => item.question && item.answer);
}

async function syncToolAreas(supabase: Awaited<ReturnType<typeof getSupabaseServerAuthClient>>, toolId: string, areaIds: string[]) {
  const { error: deleteError } = await supabase.from("tool_areas").delete().eq("tool_id", toolId);
  if (deleteError) throw new Error(deleteError.message);
  if (!areaIds.length) return;

  const payload = areaIds.map((areaId, index) => ({ tool_id: toolId, area_id: areaId, sort_order: index }));
  const { error: insertError } = await supabase.from("tool_areas").insert(payload);
  if (insertError) throw new Error(insertError.message);
}

async function syncToolUseCases(supabase: Awaited<ReturnType<typeof getSupabaseServerAuthClient>>, toolId: string, useCaseIds: string[]) {
  const { error: deleteError } = await supabase.from("tool_use_cases").delete().eq("tool_id", toolId);
  if (deleteError) throw new Error(deleteError.message);
  if (!useCaseIds.length) return;

  const payload = useCaseIds.map((useCaseId, index) => ({ tool_id: toolId, use_case_id: useCaseId, sort_order: index }));
  const { error: insertError } = await supabase.from("tool_use_cases").insert(payload);
  if (insertError) throw new Error(insertError.message);
}

function revalidateToolSurfaces() {
  revalidatePath("/");
  revalidatePath("/areas");
  revalidatePath("/buscar");
  revalidatePath("/estudiantes");
  revalidatePath("/tendencias");
  revalidatePath("/herramientas/[slug]");
  revalidatePath("/admin/tools");
  revalidatePath("/admin/relations");
}

export async function createToolAction(formData: FormData) {
  try {
    await ensureStaffUser();
    const supabase = await getSupabaseServerAuthClient();

    const name = (formData.get("name")?.toString() ?? "").trim();
    const providedSlug = (formData.get("slug")?.toString() ?? "").trim();
    const slug = slugify(providedSlug || name);
    const description = normalizeNullableText(formData.get("description"));
    const tagline = normalizeNullableText(formData.get("tagline"));
    const editorialSummary = normalizeNullableText(formData.get("editorial_summary"));
    const companyName = normalizeNullableText(formData.get("company_name"));
    const demoVideoUrl = normalizeNullableText(formData.get("demo_video_url"));
    const rawUrl = (formData.get("url")?.toString() ?? "").trim();
    const url = normalizeUrl(rawUrl);
    const plan = (formData.get("plan")?.toString() ?? "free") as ToolPlan;
    const level = (formData.get("level")?.toString() ?? "all") as ToolLevel;
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const status = (formData.get("status")?.toString() ?? "published") as ToolStatus;
    const sortOrder = Number.parseInt(formData.get("sort_order")?.toString() ?? "0", 10) || 0;
    const areaIds = getDistinctIds(formData, "area_ids");
    const useCaseIds = getDistinctIds(formData, "use_case_ids");

    if (!name || !slug || !url || areaIds.length === 0 || useCaseIds.length === 0) {
      redirect("/admin/tools?err=Completa%20nombre%2C%20slug%2C%20url%20y%20al%20menos%20un%20area%20y%20un%20caso%20de%20uso");
    }

    let coverImageUrl = normalizeNullableText(formData.get("cover_image_url"));
    let uploadedLogoUrl: string | null = null;

    const logoFile = formData.get("cover_image_file");
    if (logoFile instanceof File && logoFile.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(logoFile, "tools", "logo");
      if (uploadErr) redirect(`/admin/tools?err=${encodeURIComponent("Error subiendo logo: " + uploadErr)}`);
      uploadedLogoUrl = uploadedUrl;
      coverImageUrl = uploadedUrl;
    }

    const { data: insertedTool, error } = await supabase
      .from("tools")
      .insert({
        name,
        slug,
        description,
        tagline,
        editorial_summary: editorialSummary,
        company_name: companyName,
        demo_video_url: demoVideoUrl ? normalizeUrl(demoVideoUrl) : null,
        url,
        cover_image_url: coverImageUrl,
        plan,
        level,
        ia_type: iaType,
        verified: formData.get("verified") === "on",
        edu_verified: formData.get("edu_verified") === "on",
        featured: formData.get("featured") === "on",
        status,
        sort_order: sortOrder,
        platform_tags: parseListField(formData, "platform_tags"),
        language_codes: parseListField(formData, "language_codes"),
        spanish_available: formData.get("spanish_available") === "on",
        feature_bullets: parseListField(formData, "feature_bullets"),
        faq_items: parseFaqItems(formData),
      })
      .select("id")
      .single();

    if (error) {
      if (uploadedLogoUrl) await deleteMediaFileByUrl(uploadedLogoUrl);
      redirect(`/admin/tools?err=${encodeURIComponent(error.message)}`);
    }

    await syncToolAreas(supabase, insertedTool.id, areaIds);
    await syncToolUseCases(supabase, insertedTool.id, useCaseIds);
    revalidateToolSurfaces();
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
    if (!id) redirect("/admin/tools?err=ID%20de%20tool%20requerido");

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("cover_image_url, screenshot_url")
      .eq("id", id)
      .maybeSingle();

    if (existingToolError) redirect(`/admin/tools?err=${encodeURIComponent(existingToolError.message)}`);

    const { error: postToolsError } = await supabase.from("post_tools").delete().eq("tool_id", id);
    if (postToolsError) redirect(`/admin/tools?err=${encodeURIComponent(postToolsError.message)}`);

    const { error: toolAreasError } = await supabase.from("tool_areas").delete().eq("tool_id", id);
    if (toolAreasError) redirect(`/admin/tools?err=${encodeURIComponent(toolAreasError.message)}`);

    const { error: toolUseCasesError } = await supabase.from("tool_use_cases").delete().eq("tool_id", id);
    if (toolUseCasesError) redirect(`/admin/tools?err=${encodeURIComponent(toolUseCasesError.message)}`);

    const { error } = await supabase.from("tools").delete().eq("id", id);
    if (error) redirect(`/admin/tools?err=${encodeURIComponent(error.message)}`);

    await deleteMediaFileByUrl(existingTool?.cover_image_url);
    await deleteMediaFileByUrl(existingTool?.screenshot_url);
    revalidateToolSurfaces();
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
    const tagline = normalizeNullableText(formData.get("tagline"));
    const editorialSummary = normalizeNullableText(formData.get("editorial_summary"));
    const companyName = normalizeNullableText(formData.get("company_name"));
    const demoVideoUrl = normalizeNullableText(formData.get("demo_video_url"));
    const rawUrl = (formData.get("url")?.toString() ?? "").trim();
    const url = normalizeUrl(rawUrl);
    const plan = (formData.get("plan")?.toString() ?? "free") as ToolPlan;
    const level = (formData.get("level")?.toString() ?? "all") as ToolLevel;
    const iaType = normalizeNullableText(formData.get("ia_type"));
    const status = (formData.get("status")?.toString() ?? "published") as ToolStatus;
    const sortOrder = Number.parseInt(formData.get("sort_order")?.toString() ?? "0", 10) || 0;
    const areaIds = getDistinctIds(formData, "area_ids");
    const useCaseIds = getDistinctIds(formData, "use_case_ids");

    if (!id || !name || !slug || !url || areaIds.length === 0 || useCaseIds.length === 0) {
      redirect("/admin/tools?err=Faltan%20datos%20obligatorios%20para%20actualizar");
    }

    let coverImageUrl = normalizeNullableText(formData.get("cover_image_url"));
    let uploadedLogoUrl: string | null = null;

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("cover_image_url, screenshot_url")
      .eq("id", id)
      .maybeSingle();

    if (existingToolError) redirect(`/admin/tools?err=${encodeURIComponent(existingToolError.message)}`);
    const previousCoverImageUrl = existingTool?.cover_image_url ?? null;

    const logoFile = formData.get("cover_image_file");
    if (logoFile instanceof File && logoFile.size > 0) {
      const { url: uploadedUrl, error: uploadErr } = await uploadMediaFile(logoFile, "tools", "logo");
      if (uploadErr) redirect(`/admin/tools?err=${encodeURIComponent("Error subiendo logo: " + uploadErr)}`);
      uploadedLogoUrl = uploadedUrl;
      coverImageUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("tools")
      .update({
        name,
        slug,
        description,
        tagline,
        editorial_summary: editorialSummary,
        company_name: companyName,
        demo_video_url: demoVideoUrl ? normalizeUrl(demoVideoUrl) : null,
        url,
        cover_image_url: coverImageUrl,
        plan,
        level,
        ia_type: iaType,
        verified: formData.get("verified") === "on",
        edu_verified: formData.get("edu_verified") === "on",
        featured: formData.get("featured") === "on",
        status,
        sort_order: sortOrder,
        platform_tags: parseListField(formData, "platform_tags"),
        language_codes: parseListField(formData, "language_codes"),
        spanish_available: formData.get("spanish_available") === "on",
        feature_bullets: parseListField(formData, "feature_bullets"),
        faq_items: parseFaqItems(formData),
      })
      .eq("id", id);

    if (error) {
      if (uploadedLogoUrl) await deleteMediaFileByUrl(uploadedLogoUrl);
      redirect(`/admin/tools?err=${encodeURIComponent(error.message)}`);
    }

    if (previousCoverImageUrl && previousCoverImageUrl !== coverImageUrl) {
      await deleteMediaFileByUrl(previousCoverImageUrl);
    }
    await syncToolAreas(supabase, id, areaIds);
    await syncToolUseCases(supabase, id, useCaseIds);
    revalidateToolSurfaces();
    redirect("/admin/tools?ok=Tool%20actualizada%20correctamente");
  } catch (err: unknown) {
    if (isNextNavigationError(err)) throw err;
    redirect("/admin/tools?err=No%20fue%20posible%20actualizar%20la%20tool");
  }
}
