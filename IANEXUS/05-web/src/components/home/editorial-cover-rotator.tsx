"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

export type EditorialCoverSlide = {
  id: string;
  href: string;
  title: string;
  eyebrow: string;
  preview: string;
  publishedLabel: string | null;
  mediaUrl: string | null;
};

function CoverStoryMedia({
  mediaUrl,
  title,
}: {
  mediaUrl: string | null;
  title: string;
}) {
  return (
    <div className="group relative block aspect-[16/9] overflow-hidden rounded-[1.75rem] border-2 border-[#1f2740]/10 bg-[radial-gradient(circle_at_top_left,#eff3ff_0%,#d8e1ff_22%,#cfd7e8_58%,#b7becc_100%)] shadow-[0_28px_58px_rgba(15,23,42,0.1)]">
      {mediaUrl ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={mediaUrl}
              alt={title}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
              className="object-cover transition duration-700 group-hover:scale-[1.025]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(15,23,42,0.08)_32%,rgba(15,23,42,0.22)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.28)_100%)]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#8aa8ff_0%,#6e7cff_28%,#18243e_100%)]" />
      )}

      <div className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/84 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#243046] backdrop-blur-sm">
        Cover story
      </div>
    </div>
  );
}

export default function EditorialCoverRotator({
  slides,
}: {
  slides: EditorialCoverSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 10_000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, slideCount]);

  const translateStyle = useMemo(
    () => ({
      transform: `translateX(-${activeIndex * 100}%)`,
    }),
    [activeIndex],
  );

  if (!slideCount) {
    return (
      <article className="editorial-rule flex flex-col gap-5 lg:border-r lg:pr-8">
        <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#1f2740]/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(233,239,255,0.58)_52%,rgba(242,237,255,0.56)_100%)] px-6 py-6 shadow-[0_22px_48px_rgba(15,23,42,0.06)] md:px-7 md:py-7">
          <p className="editorial-kicker text-[#3351c8]">Portada</p>
          <h2 className="editorial-display mt-3 max-w-3xl text-[2.35rem] leading-[0.95] font-semibold tracking-[-0.05em] text-[#111827] md:text-[3.5rem]">
            La lectura principal de IA NEXUS aparecerá aquí
          </h2>
          <p className="mt-4 max-w-3xl text-[1rem] leading-7 text-[#4b5568] md:text-[1.04rem]">
            Cuando existan publicaciones recientes, esta portada rotará automáticamente entre las historias más importantes.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-[#172033] bg-[#172033] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#0f172a]"
            >
              Ir al blog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="editorial-rule flex flex-col gap-5 lg:border-r lg:pr-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={translateStyle}>
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full">
              <Link href={slide.href}>
                <CoverStoryMedia mediaUrl={slide.mediaUrl} title={slide.title} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={translateStyle}>
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full">
              <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#1f2740]/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(233,239,255,0.58)_52%,rgba(242,237,255,0.56)_100%)] px-6 py-6 shadow-[0_22px_48px_rgba(15,23,42,0.06)] md:px-7 md:py-7">
                <div className="pointer-events-none absolute inset-y-0 right-0 w-44 bg-[radial-gradient(circle_at_center,rgba(107,194,162,0.16)_0%,rgba(107,194,162,0)_74%)]" />
                <p className="editorial-kicker text-[#3351c8]">{slide.eyebrow}</p>
                <h2 className="editorial-display mt-3 max-w-3xl text-[2.35rem] leading-[0.95] font-semibold tracking-[-0.05em] text-[#111827] md:text-[3.5rem]">
                  {slide.title}
                </h2>
                <p className="mt-4 max-w-3xl text-[1rem] leading-7 text-[#4b5568] md:text-[1.04rem]">
                  {slide.preview}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 rounded-full border border-[#172033] bg-[#172033] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#0f172a]"
                  >
                    Leer portada
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {slide.publishedLabel ? (
                    <span className="rounded-full border border-slate-200 bg-white/72 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                      {slide.publishedLabel}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slideCount > 1 ? (
        <div className="flex items-center gap-2 px-1">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir a la portada ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-[#172033]"
                  : "w-2.5 bg-[#cdd6e5] hover:bg-[#9aa7c3]"
              }`}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
