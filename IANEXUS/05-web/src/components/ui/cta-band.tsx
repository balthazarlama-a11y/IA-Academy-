import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABand() {
  return (
    <div
      className="rounded-[24px] p-8 overflow-hidden max-w-4xl w-full"
      style={{
        background: "rgba(255, 255, 255, 0.30)",
        backdropFilter: "blur(20px) saturate(160%)",
        border: "1px solid rgba(255, 255, 255, 0.50)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.70)",
      }}
    >
      <div className="flex items-center justify-between gap-6">
        {/* Texto */}
        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-zinc-900 mb-1">
            ¿Listo para empezar?
          </h3>
          <p className="text-sm text-zinc-600">
            Únete gratis a una comunidad sobre IA.
          </p>
        </div>

        {/* Botón */}
        <Link
          href="https://chat.whatsapp.com/tu-enlace-general"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-full px-8 py-3 font-semibold hover:scale-105 transition-transform whitespace-nowrap"
        >
          Entrar <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
