import { NextResponse } from "next/server";

import { whatsappService } from "@/services/whatsapp";

export const runtime = "nodejs";

type SendBody = {
  phone?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: SendBody;

  try {
    body = (await request.json()) as SendBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body JSON inválido" },
      { status: 400 }
    );
  }

  if (!body.phone?.trim() || !body.message?.trim()) {
    return NextResponse.json(
      { ok: false, error: "phone y message son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const sent = await whatsappService.sendMessage(
      body.phone.trim(),
      body.message.trim()
    );
    return NextResponse.json({ ok: true, sent });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No fue posible enviar el mensaje";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
