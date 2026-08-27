import { NextResponse } from "next/server";
import { buildWhatsAppTemplate, getWhatsAppDirectUrl, WhatsAppMessagePayload } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const payload: WhatsAppMessagePayload = await req.json();

    if (!payload.phone || !payload.type) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos (phone o type)" },
        { status: 400 }
      );
    }

    const message = buildWhatsAppTemplate(payload);
    const directUrl = getWhatsAppDirectUrl(payload.phone, message);

    return NextResponse.json({
      success: true,
      type: payload.type,
      phone: payload.phone,
      message,
      directUrl,
      sentAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error procesando automatización de WhatsApp", details: err?.message },
      { status: 500 }
    );
  }
}
