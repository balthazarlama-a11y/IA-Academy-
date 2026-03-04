import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login - IA NEXUS",
  description: "Acceso a contenido y panel de IA NEXUS.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") ? params.next : "/estudiantes";

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-7">
          <h1 className="text-2xl font-semibold text-white">Accede a IA NEXUS</h1>
          <p className="mt-2 text-white/60 text-sm">
            Inicia sesion o crea tu cuenta para ver contenido completo, herramientas
            y tu panel si tienes rol admin o master.
          </p>

          <div className="mt-6">
            <LoginForm nextPath={nextPath} />
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/55">
            Puedes volver al{" "}
            <Link href="/" className="text-blue-300 hover:text-blue-200">
              inicio
            </Link>
            en cualquier momento.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
