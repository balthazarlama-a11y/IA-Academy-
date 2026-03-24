"use client";

import Link from "next/link";
import {
  markdownToPostContentBlocks,
  normalizePostContentBlocks,
  type PostContentBlock,
} from "@/lib/types/post";
import { renderPostBlock } from "./post-blocks";

interface PostContentProps {
  content: string | null | undefined;
  contentJson?: PostContentBlock[] | null;
  isLoggedIn: boolean;
  slug: string;
}

function getResolvedBlocks(content: string, contentJson?: PostContentBlock[] | null) {
  if (contentJson && contentJson.length > 0) {
    return normalizePostContentBlocks(contentJson);
  }

  return markdownToPostContentBlocks(content);
}

export function PostContent({ content, contentJson, isLoggedIn, slug }: PostContentProps) {
  const normalizedContent = typeof content === "string" ? content : "";
  const blocks = getResolvedBlocks(normalizedContent, contentJson);
  const previewBlocks = blocks.slice(0, 3);

  if (isLoggedIn) {
    return <div className="mt-8 space-y-2.5">{blocks.map((block, index) => renderPostBlock(block, index))}</div>;
  }

  return (
    <>
      <div className="mt-8 space-y-2.5">{previewBlocks.map((block, index) => renderPostBlock(block, index))}</div>

      <div className="mt-8 rounded-xl border border-violet-300/25 bg-violet-400/8 p-5">
        <h2 className="text-base font-semibold text-slate-900">Desbloquea la guia completa</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Inicia sesión para ver todos los pasos, recomendaciones y el catalogo completo de
          herramientas relacionadas.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/login?next=${encodeURIComponent(`/blog/${slug}`)}`}
            className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/estudiantes"
            className="inline-flex rounded-full border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
          >
            Ver catalogo
          </Link>
        </div>
      </div>
    </>
  );
}
