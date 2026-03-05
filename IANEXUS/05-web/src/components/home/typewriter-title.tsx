"use client";

import { useEffect, useMemo, useState } from "react";

type Phase = "idle" | "typing" | "deleting";

type TypewriterTitleProps = {
  /** Single phrase (backwards compat) */
  text?: string;
  /** Multiple phrases — cycles through them with backspace animation */
  phrases?: string[];
  className?: string;
  /** Apply gradient text (blue → purple) */
  gradient?: boolean;
  speedMs?: number;
  deleteSpeedMs?: number;
  /** How long to hold the fully-typed phrase before deleting */
  holdMs?: number;
  startDelayMs?: number;
};

export default function TypewriterTitle({
  text,
  phrases,
  className,
  gradient = false,
  speedMs = 52,
  deleteSpeedMs = 26,
  holdMs = 2400,
  startDelayMs = 180,
}: TypewriterTitleProps) {
  const allPhrases = useMemo(() => {
    if (phrases?.length) return phrases;
    if (text) return [text];
    return [""];
  }, [phrases, text]);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const isMulti = allPhrases.length > 1;

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [count, setCount] = useState(() =>
    reducedMotion ? (allPhrases[0]?.length ?? 0) : 0,
  );
  const [phase, setPhase] = useState<Phase>(() =>
    reducedMotion ? "typing" : "idle",
  );

  const current = allPhrases[phraseIdx];

  useEffect(() => {
    if (reducedMotion) return;

    if (phase === "idle") {
      const t = setTimeout(() => setPhase("typing"), startDelayMs);
      return () => clearTimeout(t);
    }

    if (phase === "typing") {
      if (count < current.length) {
        const t = setTimeout(() => setCount((c) => c + 1), speedMs);
        return () => clearTimeout(t);
      }
      if (isMulti) {
        const t = setTimeout(() => setPhase("deleting"), holdMs);
        return () => clearTimeout(t);
      }
      return; // single phrase — done, stay
    }

    if (phase === "deleting") {
      if (count > 0) {
        const t = setTimeout(() => setCount((c) => c - 1), deleteSpeedMs);
        return () => clearTimeout(t);
      }
      // count reached 0 — advance to next phrase
      const t = setTimeout(() => {
        setPhraseIdx((i) => (i + 1) % allPhrases.length);
        setPhase("typing");
      }, deleteSpeedMs);
      return () => clearTimeout(t);
    }
  }, [
    phase,
    count,
    current,
    isMulti,
    allPhrases.length,
    reducedMotion,
    startDelayMs,
    holdMs,
    speedMs,
    deleteSpeedMs,
  ]);

  const shown = current.slice(0, count);

  const titleStyle = gradient
    ? {
        backgroundImage:
          "linear-gradient(95deg, #2563eb 0%, #7c3aed 50%, #0f766e 100%)",
        WebkitBackgroundClip: "text" as const,
        WebkitTextFillColor: "transparent" as const,
        backgroundClip: "text" as const,
      }
    : { color: "rgba(15,23,42,0.96)" };

  return (
    <h1 className={className} style={titleStyle}>
      {shown}
      {!reducedMotion && (
        <span aria-hidden="true" className="cursor-blink" />
      )}
    </h1>
  );
}
