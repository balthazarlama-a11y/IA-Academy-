import Link from "next/link";

export default function FundamentalsHero() {
  return (
    <section className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-xl md:p-8">
      <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/60">
        Dia a dia
      </p>
      <h1
        className="mt-4 text-3xl font-semibold leading-tight md:text-5xl"
        style={{
          backgroundImage: "linear-gradient(to right, #67e8f9, #a78bfa, #6ee7b7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Fundamentals
      </h1>
      <p className="mt-3 max-w-3xl text-sm text-white/65 md:text-base">
        Lo esencial para moverte rapido cada dia: herramientas utiles y lecturas nuevas
        sin ruido.
      </p>
      <div className="mt-6">
        <Link
          href="/dia-a-dia"
          className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/15"
        >
          Volver a Dia a Dia
        </Link>
      </div>
    </section>
  );
}
