/**
 * Settings Admin Page (Master Only)
 * Placeholder - Configuraciones en Fase 5
 */

import { Settings, Shield } from "lucide-react";

export const metadata = {
  title: "Configuración — Admin YourAI",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900">Configuración</h2>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                color: "rgba(251, 146, 60, 0.90)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
              }}
            >
              <Shield className="h-3 w-3" />
              Master
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Configuración avanzada del sistema
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div
        className="p-12 rounded-xl text-center"
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          border: "1px solid rgba(148, 163, 184, 0.28)",
        }}
      >
        <div
          className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(241, 245, 249, 0.95)" }}
        >
          <Settings className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-1">
          Configuración en desarrollo
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Las opciones avanzadas de configuración estarán disponibles en la
          Fase 5. Solo accesible para usuarios Master.
        </p>
      </div>
    </div>
  );
}

