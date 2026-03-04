import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ToolDetail from "@/components/tools/tool-detail";
import RelatedPosts from "@/components/tools/related-posts";
import { getRelatedPostsByToolSlug } from "@/lib/repositories/post-tools-repo";
import { getToolBySlug } from "@/lib/repositories/tools-repo";

// ISR cada 5 minutos
export const revalidate = 300;

export async function generateStaticParams() {
  // Pre-render vacío - las páginas se generan bajo demanda con ISR
  return [];
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [tool, relatedPosts] = await Promise.all([
    getToolBySlug(decodedSlug),
    getRelatedPostsByToolSlug(decodedSlug),
  ]);

  if (!tool) {
    notFound();
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 px-6 py-10">
        <div className="mx-auto w-full max-w-4xl mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/areas" className="text-slate-500 hover:text-slate-700 transition-colors">
              Areas
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              href={`/areas?category=${encodeURIComponent(tool.category.slug)}`}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              {tool.category.name}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700">{tool.name}</span>
          </div>
        </div>

        <div className="[&>article>section:last-child]:hidden">
          <ToolDetail tool={tool} relatedPosts={relatedPosts} />
        </div>
        <RelatedPosts posts={relatedPosts} />
      </section>

      <Footer />
    </main>
  );
}
