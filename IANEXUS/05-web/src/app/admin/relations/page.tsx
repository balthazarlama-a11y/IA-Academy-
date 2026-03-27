import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { PostToolsLinker } from "@/components/admin/post-tools-linker";
import {
  linkToolToPost,
  listAdminPostToolRelations,
  listAdminPostsForRelations,
  listAdminToolsForRelations,
  unlinkToolFromPost,
} from "@/lib/repositories/post-tools-repo";

export const metadata = {
  title: "Relaciones - Admin YourAI",
};

async function ensureStaffUser() {
  const user = await getCurrentUser();
  const role = user?.role ?? null;

  if (!user || (role !== "admin" && role !== "master")) {
    throw new Error("No autorizado");
  }

  return user;
}

/**
 * Verifica si un error es un redirect error de Next.js.
 * Los redirect errors NO deben ser tratados como errores reales.
 */
function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  const digest = typeof e.digest === "string" ? e.digest : "";
  return digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND");
}

async function linkRelationAction(formData: FormData) {
  "use server";

  try {
    await ensureStaffUser();

    const postId = (formData.get("post_id")?.toString() ?? "").trim();
    const toolId = (formData.get("tool_id")?.toString() ?? "").trim();
    const sortOrderRaw = formData.get("sort_order")?.toString() ?? "0";
    const parsedSortOrder = Number.parseInt(sortOrderRaw, 10);
    const sortOrder = Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0;

    if (!postId || !toolId) {
      redirect("/admin/relations?err=Selecciona%20post%20y%20tool");
    }

    const result = await linkToolToPost({ postId, toolId, sortOrder });
    if (!result.ok) {
      redirect(`/admin/relations?err=${encodeURIComponent(result.error ?? "No se pudo guardar la relacion")}`);
    }

    revalidatePath("/admin/relations");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]");
    revalidatePath("/herramientas/[slug]");
    revalidatePath("/areas");
    revalidatePath("/estudiantes");
    revalidatePath("/dia-a-dia");
    redirect("/admin/relations?ok=Relacion%20guardada%20correctamente");
  } catch (error) {
    // NO capturar errores de redirect de Next.js - son parte del flujo normal
    if (isNextNavigationError(error)) {
      throw error;
    }

    // Solo capturar errores reales (DB, auth, etc.)
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[linkRelationAction] Error:", message);
    redirect(`/admin/relations?err=${encodeURIComponent("No fue posible guardar la relacion: " + message)}`);
  }
}

async function unlinkRelationAction(formData: FormData) {
  "use server";

  try {
    await ensureStaffUser();

    const postId = (formData.get("post_id")?.toString() ?? "").trim();
    const toolId = (formData.get("tool_id")?.toString() ?? "").trim();

    if (!postId || !toolId) {
      redirect("/admin/relations?err=Relacion%20invalida");
    }

    const result = await unlinkToolFromPost({ postId, toolId });
    if (!result.ok) {
      redirect(`/admin/relations?err=${encodeURIComponent(result.error ?? "No se pudo eliminar la relacion")}`);
    }

    revalidatePath("/admin/relations");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]");
    revalidatePath("/herramientas/[slug]");
    revalidatePath("/areas");
    revalidatePath("/estudiantes");
    revalidatePath("/dia-a-dia");
    redirect("/admin/relations?ok=Relacion%20eliminada%20correctamente");
  } catch (error) {
    // NO capturar errores de redirect de Next.js - son parte del flujo normal
    if (isNextNavigationError(error)) {
      throw error;
    }

    // Solo capturar errores reales
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[unlinkRelationAction] Error:", message);
    redirect(`/admin/relations?err=${encodeURIComponent("No fue posible eliminar la relacion: " + message)}`);
  }
}

export default async function AdminRelationsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await ensureStaffUser();
  const params = await searchParams;

  const [posts, tools, relations] = await Promise.all([
    listAdminPostsForRelations(),
    listAdminToolsForRelations(),
    listAdminPostToolRelations(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Relaciones Posts x Tools</h2>
          <p className="text-sm text-slate-500">
            Conecta publicaciones con herramientas para mostrar recomendaciones cruzadas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
          >
            Posts
          </Link>
          <Link
            href="/admin/tools"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
          >
            Tools
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <div className="inline-flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-violet-700" />
          <span>
            Estado actual: <span className="text-slate-900">{relations.length}</span> relaciones,{" "}
            <span className="text-slate-900">{posts.length}</span> posts,{" "}
            <span className="text-slate-900">{tools.length}</span> tools.
          </span>
        </div>
      </div>

      <PostToolsLinker
        posts={posts}
        tools={tools}
        relations={relations}
        successMessage={params.ok ?? ""}
        errorMessage={params.err ?? ""}
        onLink={linkRelationAction}
        onUnlink={unlinkRelationAction}
      />
    </div>
  );
}
