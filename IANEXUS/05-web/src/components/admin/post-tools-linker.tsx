"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
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
  const [isLinkPending, startLinkTransition] = useTransition();
  const [isUnlinkPending, startUnlinkTransition] = useTransition();
  const [pendingUnlinkKey, setPendingUnlinkKey] = useState<string | null>(null);

  const handleLink = (formData: FormData) => {
    startLinkTransition(() => {
      onLink(formData);
    });
  };

  const handleUnlink = (formData: FormData, relationKey: string) => {
    setPendingUnlinkKey(relationKey);
    startUnlinkTransition(() => {
      onUnlink(formData);
    });
  };

  const isRelationUpdating = (relation: AdminPostToolRelation) => {
    return isLinkPending || (isUnlinkPending && pendingUnlinkKey === `${relation.postId}:${relation.toolId}`);
  };

  return (
    <div className="space-y-6">
      {successMessage ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section
        className="rounded-2xl p-5"
        style={{ background: "rgba(255, 255, 255, 0.88)", border: "1px solid rgba(148, 163, 184, 0.32)" }}
      >
        <h3 className="mb-4 text-lg font-medium text-slate-900">Vincular post con tool</h3>
        <form action={handleLink} className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <select
            name="post_id"
            required
            disabled={isLinkPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2 disabled:opacity-50"
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
            disabled={isLinkPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
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
            disabled={isLinkPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={isLinkPending}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              {isLinkPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Guardando...
                </>
              ) : (
                "Guardar relacion"
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-slate-900">Relaciones actuales ({relations.length})</h3>

        {relations.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No hay relaciones creadas todavía.
          </div>
        ) : (
          <div className="space-y-3">
            {relations.map((relation) => (
              <div
                key={`${relation.postId}:${relation.toolId}`}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-800">
                      Post:{" "}
                      <Link href={`/blog/${relation.post.slug}`} className="text-cyan-700 hover:text-cyan-700">
                        {relation.post.title}
                      </Link>{" "}
                      <span className="text-slate-500">({relation.post.status})</span>
                    </p>
                    <p className="text-sm text-slate-700">
                      Tool:{" "}
                      <Link href={`/herramientas/${relation.tool.slug}`} className="text-violet-700 hover:text-violet-700">
                        {relation.tool.name}
                      </Link>{" "}
                      <span className="text-slate-500">({relation.tool.status})</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <form action={handleLink} className="flex items-center gap-2">
                      <input type="hidden" name="post_id" value={relation.postId} />
                      <input type="hidden" name="tool_id" value={relation.toolId} />
                      <input
                        name="sort_order"
                        type="number"
                        min={0}
                        defaultValue={relation.sortOrder}
                        disabled={isRelationUpdating(relation)}
                        className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={isRelationUpdating(relation)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        {isLinkPending ? "Actualizando..." : "Actualizar"}
                      </button>
                    </form>

                    <form
                      action={(formData) => handleUnlink(formData, `${relation.postId}:${relation.toolId}`)}
                    >
                      <input type="hidden" name="post_id" value={relation.postId} />
                      <input type="hidden" name="tool_id" value={relation.toolId} />
                      <button
                        type="submit"
                        disabled={isRelationUpdating(relation)}
                        className="rounded-lg border border-red-300/35 bg-red-400/10 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-400/15 disabled:opacity-50"
                      >
                        {isUnlinkPending && pendingUnlinkKey === `${relation.postId}:${relation.toolId}`
                          ? "Eliminando..."
                          : "Desvincular"}
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
