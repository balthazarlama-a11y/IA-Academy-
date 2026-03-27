import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import type { PostDetail, PostStatus, PostSummary } from "@/lib/types/post";
import { PostEditorItem } from "@/components/admin/post-editor-item";
import { deletePostAction, updatePostAction } from "../../actions";

export const metadata = {
  title: "Editar post - Admin YourAI",
};

type AdminPostRow = PostSummary & {
  content_md: string;
  content_json: PostDetail["content_json"];
  status: PostStatus;
  updated_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function EditAdminPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await getSupabaseServerAuthClient();
  const { id } = await params;

  const { data } = await supabase
    .from("posts")
    .select(
      "id, title, subtitle, slug, excerpt, content_md, content_json, cover_image_url, hero_image_alt, hero_image_caption, post_kind, ia_type, status, published_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const post = data as AdminPostRow;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/92 px-5 py-5 shadow-[0_18px_44px_rgba(15,23,42,0.05)] backdrop-blur md:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/posts"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span aria-hidden="true">←</span>
                Volver al archivo
              </Link>
              <span className="inline-flex rounded-full border border-[#3351c8]/15 bg-[#3351c8]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3351c8]">
                Editing workspace
              </span>
            </div>
            <div>
              <h1 className="font-[var(--font-display)] text-[2.5rem] leading-none tracking-tight text-slate-950 md:text-[3.5rem]">
                {post.title}
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 md:text-[0.98rem]">
                Edita la pieza en un canvas amplio. El documento ocupa el centro y la publicación queda disponible sólo cuando la necesites.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              `Estado: ${post.status}`,
              `Tipo: ${post.post_kind}`,
              `/${post.slug}`,
              `Actualizado ${formatDate(post.updated_at)}`,
            ].map((item) => (
              <span
                key={item}
                className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PostEditorItem
        post={post}
        updateAction={updatePostAction}
        deleteAction={deletePostAction}
      />
    </div>
  );
}

