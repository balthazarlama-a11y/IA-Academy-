/**
 * Dashboard de Administración
 * Vista principal del panel de admin
 */

import { FileText, Users, Eye, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Dashboard — Admin IA NEXUS",
};

// Stats cards data (placeholder - se conectarán a datos reales en Fase 5)
const stats = [
  {
    name: "Total Posts",
    value: "--",
    icon: FileText,
    trend: null,
  },
  {
    name: "Publicados",
    value: "--",
    icon: Eye,
    trend: null,
  },
  {
    name: "Usuarios",
    value: "--",
    icon: Users,
    trend: null,
  },
  {
    name: "Visitas",
    value: "--",
    icon: TrendingUp,
    trend: null,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          Bienvenido al Panel
        </h2>
        <p className="text-white/50">
          Aquí podrás gestionar todo el contenido de IA NEXUS. El CRUD completo
          estará disponible en la siguiente fase.
        </p>
      </section>

      {/* Stats Grid */}
      <section>
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
          Estadísticas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="p-5 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/40 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-white/90">{stat.value}</p>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <stat.icon className="h-5 w-5 text-white/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-6 rounded-xl group cursor-pointer transition-all duration-200 hover:bg-white/[0.05]"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.20), rgba(139, 92, 246, 0.20))",
              }}
            >
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-white/90 mb-1 group-hover:text-white">
              Gestionar Posts
            </h4>
            <p className="text-sm text-white/40">
              Crear, editar y publicar contenido del blog (Fase 5)
            </p>
          </div>

          <div
            className="p-6 rounded-xl group cursor-pointer transition-all duration-200 hover:bg-white/[0.05]"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.20), rgba(59, 130, 246, 0.20))",
              }}
            >
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-semibold text-white/90 mb-1 group-hover:text-white">
              Gestionar Usuarios
            </h4>
            <p className="text-sm text-white/40">
              Ver y administrar usuarios registrados (Fase 5)
            </p>
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <div
        className="p-4 rounded-xl flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.10), rgba(139, 92, 246, 0.10))",
          border: "1px solid rgba(139, 92, 246, 0.20)",
        }}
      >
        <div
          className="h-2 w-2 rounded-full animate-pulse"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          }}
        />
        <p className="text-sm text-white/70">
          <span className="font-medium text-white/90">Fase 4:</span> Scaffold
          de admin activo. El CRUD completo se implementará en la Fase 5.
        </p>
      </div>
    </div>
  );
}
