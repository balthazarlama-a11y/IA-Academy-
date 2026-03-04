"use client";

import Link from "next/link";

interface PostContentProps {
  content: string;
  isLoggedIn: boolean;
  slug: string;
}

function renderBlock(block: string, index: number) {
  const trimmed = block.trim();
  
  if (trimmed.startsWith("### ")) {
    return (
      <h3 key={index} className="text-lg font-semibold text-white mt-5">
        {trimmed.replace(/^###\s+/, "")}
      </h3>
    );
  }

  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={index} className="text-xl font-semibold text-white mt-6">
        {trimmed.replace(/^##\s+/, "")}
      </h2>
    );
  }

  if (trimmed.startsWith("# ")) {
    return (
      <h2 key={index} className="text-xl font-semibold text-white mt-6">
        {trimmed.replace(/^#\s+/, "")}
      </h2>
    );
  }

  const lines = trimmed.split("\n").map((line) => line.trim());
  const isBulletList = lines.every((line) => line.startsWith("- "));

  if (isBulletList) {
    return (
      <ul key={index} className="list-disc pl-5 space-y-1.5 text-white/75">
        {lines.map((line, lineIndex) => (
          <li key={`${index}-${lineIndex}`}>{line.replace(/^- /, "")}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="text-white/75 leading-7">
      {trimmed}
    </p>
  );
}

export function PostContent({ content, isLoggedIn, slug }: PostContentProps) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const previewBlocks = blocks.slice(0, 3);

  if (isLoggedIn) {
    return (
      <div className="mt-8 space-y-3">
        {blocks.map(renderBlock)}
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 space-y-3">
        {previewBlocks.map(renderBlock)}
      </div>

      <div className="mt-8 rounded-xl border border-violet-300/25 bg-violet-400/8 p-5">
        <h2 className="text-base font-semibold text-white">
          Desbloquea la guia completa
        </h2>
        <p className="mt-2 text-white/65 text-sm leading-relaxed">
          Inicia sesion para ver todos los pasos, recomendaciones y el
          catalogo completo de herramientas relacionadas.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/login?next=${encodeURIComponent(`/blog/${slug}`)}`}
            className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/estudiantes"
            className="inline-flex rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Ver catalogo
          </Link>
        </div>
      </div>
    </>
  );
}
