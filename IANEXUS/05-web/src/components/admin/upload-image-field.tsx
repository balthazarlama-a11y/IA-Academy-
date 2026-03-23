"use client";

import { useRef, useState } from "react";

interface UploadImageFieldProps {
  fileInputName: string;
  urlInputName: string;
  existingUrl?: string | null;
  label?: string;
  colSpan?: string;
  assetKind?: "cover" | "logo";
}

const INPUT_CLASSES =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none";

export default function UploadImageField({
  fileInputName,
  urlInputName,
  existingUrl,
  label = "Imagen de portada",
  colSpan = "md:col-span-2",
  assetKind = "cover",
}: UploadImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(existingUrl ?? null);
      setFileName(null);
      return;
    }

    const maxMb = 5;
    if (file.size > maxMb * 1024 * 1024) {
      setError(`La imagen no puede superar ${maxMb} MB`);
      e.target.value = "";
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowed.includes(file.type)) {
      setError("Formato no válido. Usa JPG, PNG, WEBP, GIF o AVIF");
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleClear() {
    setPreview(existingUrl ?? null);
    setFileName(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className={`flex flex-col gap-2 ${colSpan}`}>
      <span className="text-xs font-medium text-slate-500">{label}</span>

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className={
              assetKind === "logo"
                ? "aspect-square h-auto w-full object-contain p-4"
                : "aspect-video h-auto w-full object-cover"
            }
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800/80 text-white text-xs hover:bg-slate-900"
            aria-label="Quitar imagen"
          >
            x
          </button>
        </div>
      ) : null}

      <p className="text-[11px] text-slate-500">
        {assetKind === "logo"
          ? "El logo final se comprime y se ajusta automaticamente a un formato cuadrado para mantener consistencia visual."
          : "La imagen se comprime y se recorta en horizontal para que sirva como hero, screenshot o portada editorial."}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`${INPUT_CLASSES} cursor-pointer inline-flex items-center gap-2 px-4`}
          style={{ border: "1px solid rgba(148, 163, 184, 0.36)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {fileName ? "Cambiar imagen" : preview ? "Reemplazar imagen" : "Subir imagen"}
        </button>

        {fileName ? <span className="max-w-[200px] truncate text-xs text-slate-500">{fileName}</span> : null}
      </div>

      {error ? <p className="text-xs text-red-700">{error}</p> : null}

      <input
        ref={fileRef}
        type="file"
        name={fileInputName}
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFileChange}
        className="sr-only"
        aria-label={label}
      />

      <input
        type="hidden"
        name={urlInputName}
        value={preview && !fileName ? (preview.startsWith("data:") ? "" : preview) : ""}
        readOnly
      />
    </div>
  );
}
