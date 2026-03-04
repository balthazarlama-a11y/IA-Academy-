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
  title: "Relaciones - Admin IA NEXUS",
};

async function ensureStaffUser() {
  const user = await getCurrentUser();
  const role = user?.role ?? null;

  if (!user || (role !== "admin" && role !== "master")) {
    throw new Error("No autorizado");
  }

  return user;
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
  } catch {
    redirect("/admin/relations?err=No%20fue%20posible%20guardar%20la%20relacion");
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
  } catch {
    redirect("/admin/relations?err=No%20fue%20posible%20eliminar%20la%20relacion");
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
          <h2 className="text-2xl font-semibold text-white/90">Relaciones Posts x Tools</h2>
          <p className="text-sm text-white/50">
            Conecta publicaciones con herramientas para mostrar recomendaciones cruzadas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
          >
            Posts
          </Link>
          <Link
            href="/admin/tools"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
          >
            Tools
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
        <div className="inline-flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-violet-300" />
          <span>
            Estado actual: <span className="text-white/90">{relations.length}</span> relaciones,{" "}
            <span className="text-white/90">{posts.length}</span> posts,{" "}
            <span className="text-white/90">{tools.length}</span> tools.
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
