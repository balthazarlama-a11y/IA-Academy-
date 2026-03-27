"use client";

import { useFormStatus } from "react-dom";
import UploadImageField from "./upload-image-field";
import ToolChoiceGroup from "./tool-choice-group";
import ToolFaqField from "./tool-faq-field";
import ToolListField from "./tool-list-field";

type ToolTaxonomy = {
  id: string;
  name: string;
  slug: string;
};

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "edu_free", label: "Beneficio estudiantil" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
];

const LEVEL_OPTIONS = [
  { value: "all", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Creando...
        </>
      ) : (
        "Crear tool"
      )}
    </button>
  );
}

export function CreateToolForm({
  areas,
  useCases,
  createAction,
}: {
  areas: ToolTaxonomy[];
  useCases: ToolTaxonomy[];
  createAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={createAction} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Información base</p>
        <p className="mt-1 text-sm text-slate-500">Empieza por la identidad pública de la tool y su descripción editorial.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Nombre de la herramienta" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <input name="slug" placeholder="slug opcional" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <input name="company_name" placeholder="Empresa o equipo creador" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <input name="tagline" placeholder="Frase corta para la card" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <input name="url" required placeholder="URL oficial de la herramienta" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2" />
          <textarea name="description" rows={3} placeholder="Descripción breve para cards y listados" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2" />
          <textarea name="editorial_summary" rows={5} placeholder="Resumen largo: qué es, para quién sirve, cuándo conviene usarla y qué límites tiene." className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none md:col-span-2" />
          <input name="demo_video_url" placeholder="URL demo YouTube (opcional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2" />
        </div>
      </div>

      <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" label="Imagen principal" colSpan="md:col-span-2" assetKind="cover" />

      <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900">
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Áreas</legend>
        <p className="mb-3 text-xs text-slate-500">Selecciona una o varias áreas principales.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {areas.map((area) => (
            <label key={area.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input name="area_ids" type="checkbox" value={area.id} />
              <span>{area.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900">
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Casos de uso</legend>
        <p className="mb-3 text-xs text-slate-500">Selecciona los escenarios donde esta tool aporta valor.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <label key={useCase.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input name="use_case_ids" type="checkbox" value={useCase.id} />
              <span>{useCase.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Metadatos</p>
        <p className="mt-1 text-sm text-slate-500">Datos de clasificación y compatibilidad visibles en la ficha.</p>
        <div className="mt-4 grid gap-3">
          <input name="ia_type" placeholder="Tipo IA (opcional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <textarea name="platform_tags" rows={2} placeholder="Plataformas (web, ios, android...)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <textarea name="language_codes" rows={2} placeholder="Idiomas (ej: es, en, pt)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Publicación</p>
        <p className="mt-1 text-sm text-slate-500">Controla el plan, visibilidad y orden de aparición.</p>
        <div className="mt-4 grid gap-3">
          <ToolChoiceGroup label="Plan" name="plan" options={PLAN_OPTIONS} defaultValue="free" />
          <ToolChoiceGroup label="Nivel" name="level" options={LEVEL_OPTIONS} defaultValue="all" />
          <ToolChoiceGroup label="Estado" name="status" options={STATUS_OPTIONS} defaultValue="published" />
          <input name="sort_order" type="number" min={0} defaultValue={0} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="verified" type="checkbox" /> Verificada</label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="edu_verified" type="checkbox" /> Verificación académica</label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="spanish_available" type="checkbox" /> Interfaz en español</label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="featured" type="checkbox" /> Destacada</label>
        </div>
      </div>

      <ToolListField
        label="Features clave"
        description="Cada feature se guarda por separado y luego se serializa para Supabase."
        name="feature_bullets"
        placeholder="Ej: Genera video desde texto con control de cámara"
        addLabel="Agregar feature"
      />
      <ToolFaqField />

      <div className="md:col-span-2 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
