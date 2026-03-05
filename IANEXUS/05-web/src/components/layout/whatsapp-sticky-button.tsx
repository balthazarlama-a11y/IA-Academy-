import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";

export default function WhatsAppStickyButton() {
  return (
    <TrackedWhatsAppLink
      location="sticky"
      aria-label="Abrir grupo de WhatsApp de IA NEXUS"
      className="fixed bottom-4 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:bottom-6 md:right-6"
      style={{
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        boxShadow: "0 12px 24px rgba(34,197,94,0.35)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.83 11.83 0 0 0 12.05 0C5.57 0 .29 5.28.29 11.76c0 2.07.54 4.08 1.57 5.86L0 24l6.56-1.81a11.72 11.72 0 0 0 5.49 1.4h.01c6.48 0 11.76-5.28 11.76-11.76 0-3.14-1.22-6.1-3.3-8.35Zm-8.47 18.12h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.89 1.08 1.04-3.79-.23-.39a9.76 9.76 0 0 1-1.5-5.16c0-5.41 4.41-9.82 9.84-9.82 2.62 0 5.09 1.02 6.95 2.89a9.75 9.75 0 0 1 2.88 6.94c0 5.42-4.41 9.83-9.83 9.83Zm5.39-7.35c-.3-.15-1.77-.87-2.04-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46a8.93 8.93 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.03 1-1.03 2.43 0 1.42 1.05 2.8 1.2 2.99.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35Z" />
      </svg>
      <span className="sr-only">Unirme al grupo de WhatsApp</span>
    </TrackedWhatsAppLink>
  );
}
