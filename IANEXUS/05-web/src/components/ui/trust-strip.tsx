export default function TrustStrip() {
  const tools = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Perplexity",
    "Copilot",
    "Canva AI",
  ];

  return (
    <div className="text-center">
      {/* Label */}
      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
        Herramientas de confianza
      </p>

      {/* Tools */}
      <div className="flex items-center justify-center flex-wrap gap-4">
        {tools.map((tool, index) => (
          <div key={tool} className="flex items-center gap-4">
            <span className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
              {tool}
            </span>
            {index < tools.length - 1 && (
              <span className="text-zinc-400">·</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
