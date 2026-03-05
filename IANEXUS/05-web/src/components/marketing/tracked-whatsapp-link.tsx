"use client";

import type { CSSProperties, ReactNode } from "react";
import { WHATSAPP_GROUP_URL } from "@/config/site";
import { trackEvent, type EventLocation } from "@/lib/analytics/track";

type TrackedWhatsAppLinkProps = {
  location: EventLocation;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  children: ReactNode;
};

export function TrackedWhatsAppLink({
  location,
  className,
  style,
  ariaLabel,
  children,
}: TrackedWhatsAppLinkProps) {
  const handleClick = () => {
    trackEvent("click_whatsapp_cta", { location });
  };

  return (
    <a
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
