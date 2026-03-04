/**
 * Users Admin Page
 * Placeholder - CRUD completo en Fase 5
 */

import { Users, UserPlus } from "lucide-react";

export const metadata = {
  title: "Usuarios — Admin IA NEXUS",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Usuarios</h2>
          <p className="text-sm text-slate-500">Gestiona los usuarios registrados</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "white",
            boxShadow: "0 8px 18px rgba(99, 102, 241, 0.24)",
          }}
        >
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </button>
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
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-1">CRUD en desarrollo</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          La gestión de usuarios estará disponible en la Fase 5. Aquí podrás ver,
          editar roles y administrar permisos.
        </p>
      </div>
    </div>
  );
}
