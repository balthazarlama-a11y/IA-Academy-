import Link from "next/link";
import type {
  AdminPostToolRelation,
  AdminRelationPost,
  AdminRelationTool,
} from "@/lib/repositories/post-tools-repo";

type ActionFn = (formData: FormData) => Promise<void>;

function formatStatus(status: string) {
  switch (status) {
    case "published":
      return "published";
    case "draft":
      return "draft";
    case "scheduled":
      return "scheduled";
    case "archived":
      return "archived";
    default:
      return "unknown";
  }
}

export function PostToolsLinker({
  posts,
  tools,
  relations,
  successMessage,
  errorMessage,
  onLink,
  onUnlink,
}: {
  posts: AdminRelationPost[];
  tools: AdminRelationTool[];
  relations: AdminPostToolRelation[];
  successMessage: string;
  errorMessage: string;
  onLink: ActionFn;
  onUnlink: ActionFn;
}) {
  return (
    <div className="space-y-6">
      {successMessage ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {errorMessage}
        </div>
      ) : null}

      <section
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h3 className="mb-4 text-lg font-medium text-white/90">Vincular post con tool</h3>
        <form action={onLink} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <select
            name="post_id"
            required
            className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none md:col-span-2"
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un post
            </option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                [{formatStatus(post.status)}] {post.title}
              </option>
            ))}
          </select>

          <select
            name="tool_id"
            required
            className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona una tool
            </option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                [{formatStatus(tool.status)}] {tool.name}
              </option>
            ))}
          </select>

          <input
            name="sort_order"
            type="number"
            min={0}
            defaultValue={0}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none"
          />

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              Guardar relacion
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-white/90">Relaciones actuales ({relations.length})</h3>

        {relations.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/50">
            No hay relaciones creadas todavia.
          </div>
        ) : (
          <div className="space-y-3">
            {relations.map((relation) => (
              <div
                key={`${relation.postId}:${relation.toolId}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-white/85">
                      Post:{" "}
                      <Link href={`/blog/${relation.post.slug}`} className="text-cyan-300 hover:text-cyan-200">
                        {relation.post.title}
                      </Link>{" "}
                      <span className="text-white/45">({relation.post.status})</span>
                    </p>
                    <p className="text-sm text-white/75">
                      Tool:{" "}
                      <Link href={`/herramientas/${relation.tool.slug}`} className="text-violet-300 hover:text-violet-200">
                        {relation.tool.name}
                      </Link>{" "}
                      <span className="text-white/45">({relation.tool.status})</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <form action={onLink} className="flex items-center gap-2">
                      <input type="hidden" name="post_id" value={relation.postId} />
                      <input type="hidden" name="tool_id" value={relation.toolId} />
                      <input
                        name="sort_order"
                        type="number"
                        min={0}
                        defaultValue={relation.sortOrder}
                        className="w-24 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
                      >
                        Actualizar
                      </button>
                    </form>

                    <form action={onUnlink}>
                      <input type="hidden" name="post_id" value={relation.postId} />
                      <input type="hidden" name="tool_id" value={relation.toolId} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-300/35 bg-red-400/10 px-3 py-2 text-xs font-medium text-red-100 transition hover:bg-red-400/15"
                      >
                        Desvincular
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
