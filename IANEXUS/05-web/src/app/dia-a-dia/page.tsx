import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function DiaADiaPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            IA del dia a dia
          </h1>
          <p className="mt-4 text-white/65">
            Aqui iran herramientas base para productividad, codigo, repositorios
            y flujos practicos para uso diario.
          </p>
          <Link
            href="/estudiantes"
            className="inline-flex mt-8 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-white hover:bg-white/15 transition-colors"
          >
            Ver pagina de estudiantes
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
