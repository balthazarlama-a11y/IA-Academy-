"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterTitleProps = {
  text: string;
  className?: string;
  speedMs?: number;
  startDelayMs?: number;
};

export default function TypewriterTitle({
  text,
  className,
  speedMs = 55,
  startDelayMs = 180,
}: TypewriterTitleProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (reducedMotion) {
      const immediateTimer = setTimeout(() => {
        setVisibleCount(text.length);
      }, 0);
      return () => clearTimeout(immediateTimer);
    }

    const startTimer = setTimeout(() => {
      setStarted(true);
    }, startDelayMs);

    return () => clearTimeout(startTimer);
  }, [reducedMotion, startDelayMs, text.length]);

  useEffect(() => {
    if (!started || reducedMotion) return;

    if (visibleCount >= text.length) return;

    const writeTimer = setTimeout(() => {
      setVisibleCount((current) => Math.min(current + 1, text.length));
    }, speedMs);

    return () => clearTimeout(writeTimer);
  }, [started, reducedMotion, visibleCount, text.length, speedMs]);

  const shownText = text.slice(0, visibleCount);

  return (
    <h1 className={className} style={{ color: "rgba(15,23,42,0.96)" }}>
      {shownText}
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[0.95em] w-[2px] translate-y-[2px] animate-pulse bg-blue-500/80 align-middle"
      />
    </h1>
  );
}
