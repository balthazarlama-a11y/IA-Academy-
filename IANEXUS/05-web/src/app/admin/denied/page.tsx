"use client";

/**
 * Página de Acceso Denegado
 * Se muestra cuando un usuario con rol 'user' intenta acceder al admin
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Home, ArrowLeft } from "lucide-react";

export default function AccessDeniedPage() {
  const router = useRouter();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#f5f7fb" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-md p-8 rounded-2xl text-center"
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          border: "1px solid rgba(148, 163, 184, 0.28)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.20), rgba(249, 115, 22, 0.20))",
            border: "1px solid rgba(239, 68, 68, 0.30)",
          }}
        >
          <Shield className="h-10 w-10 text-red-400" />
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "rgba(15, 23, 42, 0.95)" }}
        >
          Acceso Denegado
        </h1>

        {/* Description */}
        <p className="text-slate-500 mb-8 leading-relaxed">
          No tienes permisos suficientes para acceder al panel de administración.
          Esta área está reservada para usuarios con rol{" "}
          <span className="text-blue-600 font-medium">Admin</span> o{" "}
          <span className="text-orange-600 font-medium">Master</span>.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "white",
              boxShadow: "0 10px 22px rgba(99, 102, 241, 0.24)",
            }}
          >
            <Home className="h-4 w-4" />
            Ir al Inicio
          </Link>
          
          <button
            onClick={() => router.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white"
            style={{
              background: "rgba(248, 250, 252, 0.9)",
              color: "rgba(51, 65, 85, 0.92)",
              border: "1px solid rgba(148, 163, 184, 0.32)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver Atrás
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-slate-400">
        IA NEXUS — Panel de Administración
      </p>
    </div>
  );
}

