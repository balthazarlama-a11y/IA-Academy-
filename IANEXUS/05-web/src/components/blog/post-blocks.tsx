"use client";

import Link from "next/link";
import type { PostContentBlock } from "@/lib/types/post";

function SmartImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading="lazy" />
  );
}

function toneClasses(tone: NonNullable<Extract<PostContentBlock, { type: "callout" }>["tone"]>) {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "note":
      return "border-violet-200 bg-violet-50 text-violet-900";
    default:
      return "border-slate-200 bg-slate-50 text-slate-900";
  }
}

export function renderPostBlock(block: PostContentBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-[1.02rem] leading-8 text-slate-700 md:text-[1.05rem]">
          {block.text}
        </p>
      );
    case "heading": {
      const level = block.level;
      if (level === 1) {
        return (
          <h2 key={index} className="mt-8 text-2xl font-semibold tracking-tight text-slate-950">
            {block.text}
          </h2>
        );
      }
      if (level === 2) {
        return (
          <h3 key={index} className="mt-8 text-xl font-semibold tracking-tight text-slate-950">
            {block.text}
          </h3>
        );
      }
      return (
        <h4 key={index} className="mt-6 text-lg font-semibold tracking-tight text-slate-950">
          {block.text}
        </h4>
      );
    }
    case "image":
      if (!block.src) {
        return (
          <div
            key={index}
            className="my-8 flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400"
          >
            Imagen pendiente de carga
          </div>
        );
      }
      return (
        <figure key={index} className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="bg-white p-3">
            <SmartImage
              src={block.src}
              alt={block.alt || block.caption || "Imagen del artículo"}
              className="block h-auto w-full rounded-xl object-contain"
            />
          </div>
          {block.caption ? (
            <figcaption className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="my-8 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-lg leading-8 text-slate-800"
        >
          <p>{block.text}</p>
          {block.cite ? (
            <footer className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              {block.cite}
            </footer>
          ) : null}
        </blockquote>
      );
    case "callout":
      return (
        <div key={index} className={`my-8 rounded-2xl border px-5 py-4 ${toneClasses(block.tone ?? "info")}`}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-current/70">Nota</p>
          <p className="mt-2 text-[1.02rem] leading-8 text-current">{block.text}</p>
        </div>
      );
    case "list":
      return block.ordered ? (
        <ol key={index} className="my-6 list-decimal space-y-3 pl-5 text-[1.02rem] leading-8 text-slate-700">
          {block.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul key={index} className="my-6 list-disc space-y-3 pl-5 text-[1.02rem] leading-8 text-slate-700">
          {block.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>{item}</li>
          ))}
        </ul>
      );
    case "divider":
      return <hr key={index} className="my-10 border-slate-200" />;
    case "tool_embed":
      if (!block.toolSlug) {
        return (
          <div
            key={index}
            className="my-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-400"
          >
            Embed de tool pendiente
          </div>
        );
      }
      return (
        <Link
          key={index}
          href={`/herramientas/${block.toolSlug}`}
          className="my-8 block rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Tool relacionada
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">{block.toolSlug}</p>
          {block.note ? <p className="mt-1 text-sm leading-relaxed text-slate-600">{block.note}</p> : null}
        </Link>
      );
    default:
      return null;
  }
}
