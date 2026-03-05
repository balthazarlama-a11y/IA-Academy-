const rawWhatsappGroupUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL?.trim();

export const WHATSAPP_GROUP_URL =
  rawWhatsappGroupUrl && rawWhatsappGroupUrl.length > 0
    ? rawWhatsappGroupUrl
    : "https://chat.whatsapp.com/tu-enlace-general";

