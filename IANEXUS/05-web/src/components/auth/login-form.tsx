"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type LoginFormProps = {
  nextPath: string;
};

type AuthMode = "signin" | "signup";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export default function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<AuthMode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const normalizedEmail = normalizeEmail(email);

    if (mode === "signup") {
      if (password.length < 8) {
        setErrorMessage("La contrasena debe tener al menos 8 caracteres.");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Las contrasenas no coinciden.");
        setIsLoading(false);
        return;
      }

      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login?next=${encodeURIComponent(nextPath)}`
          : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo,
          data: { full_name: fullName.trim() || null },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.replace(nextPath || "/estudiantes");
        router.refresh();
        return;
      }

      setSuccessMessage(
        "Cuenta creada. Revisa tu email para confirmar y luego iniciar sesion.",
      );
      setMode("signin");
      setPassword("");
      setConfirmPassword("");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.replace(nextPath || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/15 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className="rounded-lg px-3 py-2 text-sm font-medium transition"
          style={
            mode === "signin"
              ? {
                  background: "rgba(59,130,246,0.24)",
                  border: "1px solid rgba(96,165,250,0.5)",
                  color: "rgba(255,255,255,0.95)",
                }
              : { color: "rgba(255,255,255,0.65)" }
          }
        >
          Iniciar sesion
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className="rounded-lg px-3 py-2 text-sm font-medium transition"
          style={
            mode === "signup"
              ? {
                  background: "rgba(139,92,246,0.24)",
                  border: "1px solid rgba(167,139,250,0.5)",
                  color: "rgba(255,255,255,0.95)",
                }
              : { color: "rgba(255,255,255,0.65)" }
          }
        >
          Crear cuenta
        </button>
      </div>

      {mode === "signup" ? (
        <div>
          <label htmlFor="full_name" className="block text-sm text-white/70 mb-1.5">
            Nombre
          </label>
          <input
            id="full_name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-white outline-none focus:border-blue-400/60"
            placeholder="Tu nombre"
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm text-white/70 mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-white outline-none focus:border-blue-400/60"
          placeholder="tu-email@dominio.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm text-white/70 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-white outline-none focus:border-blue-400/60"
          placeholder="Tu password"
        />
      </div>

      {mode === "signup" ? (
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm text-white/70 mb-1.5"
          >
            Confirmar password
          </label>
          <input
            id="confirm_password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-3.5 py-2.5 text-white outline-none focus:border-blue-400/60"
            placeholder="Repite tu password"
          />
        </div>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/25 rounded-xl px-3 py-2">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/25 rounded-xl px-3 py-2">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow: "0 8px 24px rgba(59,130,246,0.25)",
        }}
      >
        {isLoading
          ? mode === "signin"
            ? "Entrando..."
            : "Creando cuenta..."
          : mode === "signin"
            ? "Iniciar sesion"
            : "Crear cuenta"}
      </button>
    </form>
  );
}
