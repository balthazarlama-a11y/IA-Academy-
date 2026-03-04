import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ToolDetail from "@/components/tools/tool-detail";
import { getRelatedPostsByTool, getToolBySlug } from "@/lib/repositories/tools-repo";

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const tool = await getToolBySlug(decodedSlug);

  if (!tool) {
    notFound();
  }

  const relatedPosts = await getRelatedPostsByTool(tool.id);

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 px-6 py-10">
        <div className="mx-auto w-full max-w-4xl mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/areas" className="text-white/50 hover:text-white/80 transition-colors">
              Areas
            </Link>
            <span className="text-white/30">/</span>
            <Link
              href={`/areas?category=${encodeURIComponent(tool.category.slug)}`}
              className="text-white/50 hover:text-white/80 transition-colors"
            >
              {tool.category.name}
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/80">{tool.name}</span>
          </div>
        </div>

        <ToolDetail tool={tool} relatedPosts={relatedPosts} />
      </section>

      <Footer />
    </main>
  );
}
