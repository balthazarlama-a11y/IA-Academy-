import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uses service role to bypass RLS for anonymous inserts from edge
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_name, location, page_path, user_id, session_id, meta } = body;

    if (!event_name || typeof event_name !== "string") {
      return NextResponse.json({ error: "event_name required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("analytics_events").insert({
      event_name,
      location: location ?? null,
      page_path: page_path ?? null,
      user_id: user_id ?? null,
      session_id: session_id ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
      meta: meta ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
