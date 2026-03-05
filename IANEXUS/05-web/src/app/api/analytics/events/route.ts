import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Lazy init client - no se crea en build time
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.warn("[analytics] SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL no configuradas");
    return null;
  }

  supabaseAdmin = createClient(url, serviceKey);
  return supabaseAdmin;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest): Promise<any> {
  try {
    // Validar que analytics está disponible
    const admin = getSupabaseAdmin();
    if (!admin) {
      console.warn("[analytics] Servicio no disponible - faltan variables de entorno");
      return NextResponse.json(
        { error: "analytics_unavailable", message: "Analytics no configurado" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { event_name, location, page_path, user_id, session_id, meta } = body;

    if (!event_name || typeof event_name !== "string") {
      return NextResponse.json(
        { error: "event_name required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: Record<string, any> = {
      event_name,
      location: location ?? null,
      page_path: page_path ?? null,
      user_id: user_id ?? null,
      session_id: session_id ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
      meta: meta ?? null,
    };

    const { error } = await admin
      .from("analytics_events")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(insertData as any);

    if (error) {
      console.error("[analytics] Error insertando evento:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log(`[analytics] Evento registrado: ${event_name} (${location ?? "no-location"})`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[analytics] Error procesando request:", err);
    return NextResponse.json(
      { error: "invalid request" },
      { status: 400 }
    );
  }
}
