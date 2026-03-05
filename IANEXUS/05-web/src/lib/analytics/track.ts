"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type TrackableEvent =
  | "click_whatsapp_cta"
  | "click_join_community"
  | "view_tool"
  | "copy_prompt";

export type EventLocation =
  | "hero"
  | "sticky"
  | "footer"
  | "blog_banner"
  | "areas_banner"
  | "tool_card"
  | "tool_detail"
  | (string & Record<never, never>);

interface TrackEventOptions {
  location?: EventLocation;
  meta?: Record<string, unknown>;
}

let _sessionId: string | null = null;

function getSessionId(): string {
  if (_sessionId) return _sessionId;
  if (typeof window === "undefined") return "ssr";
  const stored = sessionStorage.getItem("_ia_sid");
  if (stored) {
    _sessionId = stored;
    return _sessionId;
  }
  const newId = crypto.randomUUID();
  sessionStorage.setItem("_ia_sid", newId);
  _sessionId = newId;
  return _sessionId;
}

/**
 * Track a user interaction event.
 * Fire-and-forget — never throws, never blocks UX.
 */
export function trackEvent(
  eventName: TrackableEvent,
  options: TrackEventOptions = {},
): void {
  if (typeof window === "undefined") return;

  void (async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await supabase.from("analytics_events").insert({
        event_name: eventName,
        location: options.location ?? null,
        page_path: window.location.pathname,
        user_id: session?.user.id ?? null,
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        meta: options.meta ?? null,
      });
    } catch {
      // Analytics must never break UX
    }
  })();
}
