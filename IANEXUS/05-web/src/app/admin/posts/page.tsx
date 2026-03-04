/**
 * Posts Admin Page
 * Placeholder - CRUD completo en Fase 5
 */

import { FileText, Plus } from "lucide-react";

export const metadata = {
  title: "Posts — Admin IA NEXUS",
};

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white/90">Posts</h2>
          <p className="text-sm text-white/40">
            Gestiona el contenido del blog
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.30)",
          }}
        >
          <Plus className="h-4 w-4" />
          Nuevo Post
        </button>
      </div>

      {/* Empty State */}
      <div
        className="p-12 rounded-xl text-center"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255, 255, 255, 0.05)" }}
        >
          <FileText className="h-8 w-8 text-white/30" />
        </div>
        <h3 className="text-lg font-medium text-white/70 mb-1">
          CRUD en desarrollo
        </h3>
        <p className="text-sm text-white/40 max-w-sm mx-auto">
          La gestión completa de posts estará disponible en la Fase 5. Aquí
          podrás crear, editar y eliminar contenido.
        </p>
      </div>
    </div>
  );
}
