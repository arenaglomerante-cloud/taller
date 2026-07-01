import { NextResponse } from "next/server";

import { whatsappService } from "@/services/whatsapp";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, status: whatsappService.getStatus() });
}
