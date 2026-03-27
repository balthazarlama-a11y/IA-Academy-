import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AreasToolbar from "@/components/areas/areas-toolbar";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import { getAreas, getUseCases } from "@/lib/repositories/tool-taxonomy-repo";
import { getTools } from "@/lib/repositories/tools-repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Áreas y casos de uso | YourAI",
  description: "Explora herramientas de IA por área principal y caso de uso con una taxonomía simple y utilizable.",
};

export default async function AreasPage() {
  const [areas, useCases, tools] = await Promise.all([
    getAreas(),
    getUseCases(),
    getTools({ limit: 150 }),
  ]);

  return (
    <main className="relative flex min-h-screen flex-col bg-[linear-gradient(180deg,#f8f3ea_0%,#fbf8f3_40%,#ffffff_100%)]">
      <Header />

      <section className="flex-1 w-full px-5 py-8 md:px-6 md:py-10 xl:px-8">
        <div className="editorial-frame flex flex-col gap-6">
          <AreasToolbar initialTools={tools} areas={areas} useCases={useCases} />
          <div className="w-full max-w-3xl">
            <CommunityCtaBanner location="areas_banner" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
