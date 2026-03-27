import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import SearchPageContent from "@/components/search/search-page-content";
import { getSearchPageData } from "@/lib/repositories/search-repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar herramientas | YourAI",
  description:
    "Encuentra herramientas de IA por necesidad, carrera o plan con una búsqueda directa y editorial.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : "";
}

export default async function BuscarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getSearchPageData({
    q: readString(params.q),
    area: readString(params.area),
    useCase: readString(params.useCase),
    plan: readString(params.plan) as "" | "free" | "freemium" | "paid" | "edu_free",
    iaType: readString(params.iaType),
  });

  return (
    <main className="relative flex min-h-screen flex-col bg-[linear-gradient(180deg,#f5f2ec_0%,#faf8f4_45%,#ffffff_100%)]">
      <Header />

      <section className="flex-1 px-5 py-8 md:px-6 md:py-10 xl:px-8">
        <SearchPageContent data={data} />
      </section>

      <Footer />
    </main>
  );
}
