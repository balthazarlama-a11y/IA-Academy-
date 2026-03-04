"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImageAction } from "@/app/admin/upload-actions";

interface UploadImageInlineProps {
  textareaId: string;
  folder?: "posts" | "tools";
}

export default function UploadImageInline({
  textareaId,
  folder = "posts",
}: UploadImageInlineProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadStatus, setUploadStatus] = useState<"idle" | "done" | "error">("idle");
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

  function insertAtCursor(markdown: string) {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const before = textarea.value.slice(0, start);
    const prefix = before.length > 0 && !before.endsWith("\n") ? "\n" : "";
    const insertion = `${prefix}${markdown}\n`;

    textarea.setRangeText(insertion, start, end, "end");
    const nextPos = start + insertion.length;
    textarea.setSelectionRange(nextPos, nextPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus("idle");
    setMessage(null);

    const validationError = validateFile(file);
    if (validationError) {
      setUploadStatus("error");
      setMessage(validationError);
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    startTransition(async () => {
      const result = await uploadImageAction(formData);
      if (result.error) {
        setUploadStatus("error");
        setMessage(result.error);
      } else if (result.url) {
        setUploadStatus("done");
        setMessage("Imagen insertada");
        insertAtCursor(`![imagen](${result.url})`);
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        {isPending ? "Subiendo..." : "Insertar imagen en contenido"}
      </button>

      {uploadStatus === "done" ? <span className="text-xs text-emerald-400">OK: {message}</span> : null}
      {uploadStatus === "error" ? <span className="text-xs text-red-400">Error: {message}</span> : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Insertar imagen en contenido"
      />
    </div>
  );
}

