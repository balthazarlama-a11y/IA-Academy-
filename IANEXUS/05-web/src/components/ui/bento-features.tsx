import { Rss, Gem, BadgeCheck, Users } from "lucide-react";

const FEATURES = [
  {
    title: "Curación semanal",
    subtitle: "Lo más relevante sin ruido",
    icon: Rss,
    span: "md:col-span-2",
  },
  {
    title: "Gemas Gemini",
    subtitle: "Prompts por especialidad",
    icon: Gem,
  },
  {
    title: "Solo verificado",
    subtitle: "Probado y actualizado",
    icon: BadgeCheck,
  },
  {
    title: "Una comunidad",
    subtitle: "Todo sobre IA",
    icon: Users,
  },
];

export default function BentoFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className={`rounded-[20px] p-6 overflow-hidden ${feature.span || ""}`}
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px) saturate(160%)",
              border: "1px solid rgba(255, 255, 255, 0.50)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.70)",
              filter: "url(#glass-distortion)",
            }}
          >
            {/* Capa distorsión */}
            <div
              className="absolute inset-0 z-0 rounded-[inherit] overflow-hidden"
              style={{
                backdropFilter: "blur(3px)",
                filter: "url(#glass-distortion)",
                isolation: "isolate",
              }}
            />

            {/* Contenido */}
            <div className="relative z-10 flex flex-col gap-2">
              <Icon className="h-8 w-8 text-zinc-700" />
              <h3 className="font-semibold text-zinc-900">{feature.title}</h3>
              <p className="text-xs text-zinc-600">{feature.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
