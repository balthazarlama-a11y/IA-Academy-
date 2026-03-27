import Link from "next/link";
import { CreatePostForm } from "@/components/admin/create-post-form";
import { createPostAction } from "../actions";

export const metadata = {
  title: "Nuevo post - Admin YourAI",
};

export default async function NewAdminPostPage() {

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/92 px-5 py-5 shadow-[0_18px_44px_rgba(15,23,42,0.05)] backdrop-blur md:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/posts"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span aria-hidden="true">←</span>
                Volver al archivo
              </Link>
              <span className="inline-flex rounded-full border border-[#3351c8]/15 bg-[#3351c8]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3351c8]">
                New editorial piece
              </span>
            </div>
            <div>
              <h1 className="font-[var(--font-display)] text-[2.5rem] leading-none tracking-tight text-slate-950 md:text-[3.5rem]">
                Nuevo post
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 md:text-[0.98rem]">
                Escribe en un canvas amplio, sube la portada y construye el artículo como un documento continuo. La publicación y el preview se abren sólo cuando los necesitas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Titulo, subtitulo y excerpt primero",
              "Una sola portada editorial",
              "Preview bajo demanda",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CreatePostForm createAction={createPostAction} />
    </div>
  );
}

