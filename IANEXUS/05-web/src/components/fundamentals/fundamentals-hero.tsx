import Link from "next/link";

export default function FundamentalsHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 backdrop-blur-xl md:p-8">
      <p className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-slate-600">
        Día a día
      </p>
      <h1
        className="mt-4 text-3xl font-semibold leading-tight md:text-5xl"
        style={{
          backgroundImage: "linear-gradient(to right, #0284c7, #6366f1, #059669)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Fundamentals
      </h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
        Lo esencial para moverte rápido cada día: herramientas útiles y lecturas nuevas
        sin ruido.
      </p>
      <div className="mt-6">
        <Link
          href="/dia-a-dia"
          className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          Volver a Día a Día
        </Link>
      </div>
    </section>
  );
}

