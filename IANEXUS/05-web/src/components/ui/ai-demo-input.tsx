"use client";

export default function AIDemoInput() {
  return (
    <div className="w-full max-w-2xl">
      {/* Label */}
      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4 text-center">
        Ejemplo de prompt para tu Gema Gemini
      </p>

      {/* Glass Input Container */}
      <div
        className="rounded-[24px] p-5 overflow-hidden mb-4"
        style={{
          background: "rgba(255, 255, 255, 0.30)",
          backdropFilter: "blur(20px) saturate(160%)",
          border: "1px solid rgba(255, 255, 255, 0.50)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.70)",
        }}
      >
        {/* Capa distorsión */}
        <div
          className="absolute inset-0 z-0 rounded-[24px] overflow-hidden"
          style={{
            backdropFilter: "blur(3px)",
            filter: "url(#glass-distortion)",
            isolation: "isolate",
          }}
        />

        {/* Texto y cursor */}
        <div className="relative z-10">
          <p className="text-zinc-700 text-sm leading-relaxed">
            Eres un asistente de salud para estudiantes. Explica conceptos
            complejos en 3 niveles: básico, intermedio y aplicación real.
            <span className="cursor-blink" />
          </p>
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-3 justify-center flex-wrap">
        {["Para Salud", "Para Código", "Para Diseño"].map((chip) => (
          <button
            key={chip}
            className="px-3 py-1 text-xs font-medium text-zinc-700 rounded-full hover:text-zinc-900 transition-colors"
            style={{
              background: "rgba(255, 255, 255, 0.40)",
              border: "1px solid rgba(255, 255, 255, 0.50)",
              backdropFilter: "blur(12px)",
            }}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
