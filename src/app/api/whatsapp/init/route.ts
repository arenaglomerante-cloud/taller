import { NextResponse } from "next/server";

import { whatsappService } from "@/services/whatsapp";

export const runtime = "nodejs";

export async function POST() {
  try {
    const status = await whatsappService.initialize();
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No fue posible iniciar WhatsApp";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
