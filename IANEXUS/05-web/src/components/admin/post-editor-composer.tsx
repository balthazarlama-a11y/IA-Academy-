"use client";

import { useMemo, useRef, useState, useTransition, type ChangeEvent } from "react";
import { uploadImageAction } from "@/app/admin/upload-actions";
import { renderPostBlock } from "@/components/blog/post-blocks";
import {
  markdownToPostContentBlocks,
  normalizePostContentBlocks,
  postContentBlocksToMarkdown,
  type PostContentBlock,
} from "@/lib/types/post";

type EditorBlock = PostContentBlock & { _id: string };
type BlockType = PostContentBlock["type"];

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
}

function createBlock(type: BlockType): EditorBlock {
  switch (type) {
    case "heading":
      return { _id: createId(), type, level: 2, text: "Nuevo subtítulo" };
    case "image":
      return { _id: createId(), type, src: "", alt: "", caption: "" };
    case "quote":
      return { _id: createId(), type, text: "Una cita editorial breve para reforzar la idea.", cite: "" };
    case "callout":
      return { _id: createId(), type, tone: "info", text: "Una nota útil que condense contexto." };
    case "list":
      return { _id: createId(), type, ordered: false, items: ["Primer punto", "Segundo punto"] };
    case "divider":
      return { _id: createId(), type };
    case "tool_embed":
      return { _id: createId(), type, toolSlug: "", note: "" };
    case "paragraph":
    default:
      return { _id: createId(), type: "paragraph", text: "Escribe el primer párrafo aquí." };
  }
}

function createDefaultBlocks(): EditorBlock[] {
  return [createBlock("paragraph")];
}

function toEditorBlocks(blocks: PostContentBlock[]): EditorBlock[] {
  if (blocks.length === 0) {
    return createDefaultBlocks();
  }

  return blocks.map((block) => ({ ...block, _id: createId() }));
}

function stripEditorIds(blocks: EditorBlock[]): PostContentBlock[] {
  return blocks.map((block) => {
    const copy: Partial<EditorBlock> = { ...block };
    delete copy._id;
    return copy as PostContentBlock;
  });
}

function parseListText(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function blockIcon(type: BlockType) {
  switch (type) {
    case "heading":
      return "H";
    case "image":
      return "IMG";
    case "quote":
      return "Q";
    case "callout":
      return "NOTE";
    case "list":
      return "LIST";
    case "divider":
      return "—";
    case "tool_embed":
      return "EMB";
    case "paragraph":
    default:
      return "P";
  }
}

function blockLabel(type: BlockType) {
  switch (type) {
    case "heading":
      return "Subtítulo";
    case "image":
      return "Imagen";
    case "quote":
      return "Cita";
    case "callout":
      return "Nota";
    case "list":
      return "Lista";
    case "divider":
      return "Separador";
    case "tool_embed":
      return "Tool embed";
    case "paragraph":
    default:
      return "Párrafo";
  }
}

function BlockTypeButton({
  type,
  onClick,
}: {
  type: BlockType;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {blockIcon(type)}
      </span>
      {blockLabel(type)}
    </button>
  );
}

function ImageUploadButton({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function validateFile(file: File): string | null {
    const maxMb = 5;
    if (file.size > maxMb * 1024 * 1024) {
      return `La imagen no puede superar ${maxMb} MB`;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowed.includes(file.type)) {
      return "Formato no válido. Usa JPG, PNG, WEBP, GIF o AVIF";
    }

    return null;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage(null);
    const validationError = validateFile(file);
    if (validationError) {
      setMessage(validationError);
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "posts");
    formData.append("preset", "inline");

    startTransition(async () => {
      const result = await uploadImageAction(formData);
      if (result.error) {
        setMessage(result.error);
      } else if (result.url) {
        onChange(result.url);
        setMessage("Imagen cargada");
      }
    });

    event.target.value = "";
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        {isPending ? "Subiendo..." : value ? "Reemplazar imagen" : "Subir imagen"}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Subir imagen del bloque"
      />

      {message ? <span className="text-[11px] text-slate-500">{message}</span> : null}
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  block: EditorBlock;
  onChange: (next: EditorBlock) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] text-slate-500">
            {blockIcon(block.type)}
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Bloque editorial
            </p>
            <p className="text-sm font-medium text-slate-900">{blockLabel(block.type)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Mover bloque arriba"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Mover bloque abajo"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Duplicar bloque"
          >
            ⧉
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
            aria-label="Eliminar bloque"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4">
        {block.type === "paragraph" ? (
          <textarea
            value={block.text}
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            rows={7}
            placeholder="Escribe el párrafo editorial..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400"
          />
        ) : null}

        {block.type === "heading" ? (
          <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Nivel
              <select
                value={block.level}
                onChange={(event) =>
                  onChange({ ...block, level: Number(event.target.value) as 1 | 2 | 3 })
                }
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Texto
              <input
                value={block.text}
                onChange={(event) => onChange({ ...block, text: event.target.value })}
                placeholder="Subtítulo editorial"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
          </div>
        ) : null}

        {block.type === "image" ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              {block.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={block.src}
                  alt={block.alt || "Vista previa del bloque"}
                  className="block h-auto max-h-[420px] w-full rounded-xl object-contain"
                />
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
                  Sin imagen todavía
                </div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-medium text-slate-500 md:col-span-2">
                URL de imagen
                <input
                  value={block.src}
                  onChange={(event) => onChange({ ...block, src: event.target.value })}
                  placeholder="https://..."
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
                Alt
                <input
                  value={block.alt ?? ""}
                  onChange={(event) => onChange({ ...block, alt: event.target.value })}
                  placeholder="Texto alternativo"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
                Caption
                <input
                  value={block.caption ?? ""}
                  onChange={(event) => onChange({ ...block, caption: event.target.value })}
                  placeholder="Pie de foto"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>
              <div className="md:col-span-2">
                <ImageUploadButton
                  value={block.src}
                  onChange={(url) => onChange({ ...block, src: url })}
                />
              </div>
            </div>
          </div>
        ) : null}

        {block.type === "quote" ? (
          <div className="space-y-3">
            <textarea
              value={block.text}
              onChange={(event) => onChange({ ...block, text: event.target.value })}
              rows={4}
              placeholder="Escribe una cita."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              value={block.cite ?? ""}
              onChange={(event) => onChange({ ...block, cite: event.target.value })}
              placeholder="Fuente o firma de la cita"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>
        ) : null}

        {block.type === "callout" ? (
          <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Tono
              <select
                value={block.tone ?? "info"}
                onChange={(event) =>
                  onChange({
                    ...block,
                    tone: event.target.value as "info" | "success" | "warning" | "note",
                  })
                }
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              >
                <option value="info">Info</option>
                <option value="note">Nota</option>
                <option value="success">Éxito</option>
                <option value="warning">Alerta</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Texto
              <textarea
                value={block.text}
                onChange={(event) => onChange({ ...block, text: event.target.value })}
                rows={4}
                placeholder="Nota editorial útil"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
          </div>
        ) : null}

        {block.type === "list" ? (
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Formato
              <select
                value={block.ordered ? "ordered" : "unordered"}
                onChange={(event) => onChange({ ...block, ordered: event.target.value === "ordered" })}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              >
                <option value="unordered">Lista con viñetas</option>
                <option value="ordered">Lista numerada</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Items
              <textarea
                value={block.items.join("\n")}
                onChange={(event) => onChange({ ...block, items: parseListText(event.target.value) })}
                rows={5}
                placeholder="Un item por línea"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
          </div>
        ) : null}

        {block.type === "divider" ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            <span className="text-lg leading-none text-slate-400">—</span>
            Separador editorial
          </div>
        ) : null}

        {block.type === "tool_embed" ? (
          <div className="grid gap-3">
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Slug de tool
              <input
                value={block.toolSlug}
                onChange={(event) => onChange({ ...block, toolSlug: event.target.value })}
                placeholder="seedance-20"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              Nota
              <textarea
                value={block.note ?? ""}
                onChange={(event) => onChange({ ...block, note: event.target.value })}
                rows={3}
                placeholder="Por qué esta tool es relevante para el artículo"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function PostEditorComposer({
  initialContentMd,
  initialContentJson,
  contentJsonFieldName = "content_json",
  contentMdFieldName = "content_md",
}: {
  initialContentMd?: string | null;
  initialContentJson?: unknown;
  contentJsonFieldName?: string;
  contentMdFieldName?: string;
}) {
  const parsedInitialBlocks = useMemo(() => {
    const normalized = normalizePostContentBlocks(initialContentJson);
    if (normalized.length > 0) {
      return normalized;
    }

    const fallbackMarkdown = typeof initialContentMd === "string" ? initialContentMd : "";
    const markdownBlocks = markdownToPostContentBlocks(fallbackMarkdown);
    return markdownBlocks.length > 0 ? markdownBlocks : stripEditorIds(createDefaultBlocks());
  }, [initialContentJson, initialContentMd]);

  const [blocks, setBlocks] = useState<EditorBlock[]>(() => toEditorBlocks(parsedInitialBlocks));

  const structuredBlocks = useMemo(() => stripEditorIds(blocks), [blocks]);
  const contentJsonValue = useMemo(() => JSON.stringify(structuredBlocks), [structuredBlocks]);
  const contentMarkdownValue = useMemo(() => postContentBlocksToMarkdown(structuredBlocks), [structuredBlocks]);
  const estimatedReadTime = useMemo(() => {
    const words = contentMarkdownValue.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }, [contentMarkdownValue]);

  function updateBlock(index: number, next: EditorBlock) {
    setBlocks((current) => current.map((block, blockIndex) => (blockIndex === index ? next : block)));
  }

  function addBlock(type: BlockType, index?: number) {
    setBlocks((current) => {
      const next = [...current];
      const newBlock = createBlock(type);
      if (typeof index === "number") {
        next.splice(index + 1, 0, newBlock);
      } else {
        next.push(newBlock);
      }
      return next;
    });
  }

  function removeBlock(index: number) {
    setBlocks((current) => {
      if (current.length <= 1) {
        return createDefaultBlocks();
      }
      return current.filter((_, blockIndex) => blockIndex !== index);
    });
  }

  function duplicateBlock(index: number) {
    setBlocks((current) => {
      const block = current[index];
      if (!block) return current;
      const duplicate: EditorBlock = { ...block, _id: createId() };
      const next = [...current];
      next.splice(index + 1, 0, duplicate);
      return next;
    });
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  }

  return (
    <section className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] shadow-[0_22px_54px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#3351c8]">
            Content studio
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 md:text-[1.65rem]">
            Construye el artículo por bloques
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Combina párrafos, subtítulos, imágenes, notas, citas y embeds de tools sin pelearte
            con markdown. El editor genera el JSON estructurado y mantiene un fallback textual.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {blocks.length} bloques
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {estimatedReadTime} min aprox
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            JSON + fallback
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Insertar bloque
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Elige un bloque, ordénalo y deja el preview listo para publicación.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BlockTypeButton type="paragraph" onClick={() => addBlock("paragraph")} />
            <BlockTypeButton type="heading" onClick={() => addBlock("heading")} />
            <BlockTypeButton type="image" onClick={() => addBlock("image")} />
            <BlockTypeButton type="quote" onClick={() => addBlock("quote")} />
            <BlockTypeButton type="callout" onClick={() => addBlock("callout")} />
            <BlockTypeButton type="list" onClick={() => addBlock("list")} />
            <BlockTypeButton type="tool_embed" onClick={() => addBlock("tool_embed")} />
            <BlockTypeButton type="divider" onClick={() => addBlock("divider")} />
          </div>
        </div>
      </div>

      <div className="grid gap-0 2xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
        <div className="space-y-4 p-6">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block._id}
              block={block}
              onChange={(next) => updateBlock(index, next)}
              onRemove={() => removeBlock(index)}
              onDuplicate={() => duplicateBlock(index)}
              onMoveUp={() => moveBlock(index, -1)}
              onMoveDown={() => moveBlock(index, 1)}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
            />
          ))}
        </div>

        <aside className="border-t border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.94),rgba(255,255,255,1))] p-6 2xl:border-l 2xl:border-t-0">
          <div className="space-y-4 2xl:sticky 2xl:top-6">
            <div className="rounded-[1.6rem] border border-[#dbe2f4] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Vista editorial
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                La composición editorial se verá así en el frontend. El preview no es una copia
                exacta del layout final, pero sí valida jerarquía, ritmo y legibilidad.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  {blocks.length} bloques
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  ~{estimatedReadTime} min
                </span>
              </div>
            </div>

            <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                    Lectura pública
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    El mismo contenido, ya con el ritmo del artículo final.
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  Preview
                </span>
              </div>

              <div className="space-y-0">
                {structuredBlocks.length > 0 ? (
                  structuredBlocks.map((block, index) => (
                    <div key={`${block.type}-${index}`} className="mt-4 first:mt-0">
                      {renderPostBlock(block, index)}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    Todavía no hay bloques para previsualizar.
                  </div>
                )}
              </div>
            </article>
          </div>
        </aside>
      </div>

      <textarea name={contentJsonFieldName} value={contentJsonValue} readOnly className="sr-only" />
      <textarea name={contentMdFieldName} value={contentMarkdownValue} readOnly className="sr-only" />
    </section>
  );
}
