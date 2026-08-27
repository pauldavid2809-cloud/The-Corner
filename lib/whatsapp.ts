import { SITE_CONFIG } from "./config";
import { formatDualPrice } from "@/data/currencies";

export type WhatsAppTriggerType =
  | "TICKET_CREATED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "ORDER_PLACED"
  | "EVENT_REMINDER";

export type WhatsAppMessagePayload = {
  type: WhatsAppTriggerType;
  clientName: string;
  phone: string;
  ticketCode?: string;
  planName?: string;
  date?: string;
  time?: string;
  pax?: number;
  totalUSD?: number;
  totalVES?: number;
  paymentMethod?: string;
  paymentRef?: string;
  orderItems?: { name: string; quantity: number; priceUSD: number }[];
  orderType?: string;
  tableNumber?: string;
  customNotes?: string;
};

/**
 * Genera el texto formateado para cada tipo de automatización de WhatsApp
 */
export function buildWhatsAppTemplate(payload: WhatsAppMessagePayload): string {
  const cleanPhone = payload.phone.replace(/[^0-9]/g, "");

  switch (payload.type) {
    case "TICKET_CREATED":
      return (
        `🎟️ *[THE CORNER COSTA VERDE] REPORTE DE PAGO RECIBIDO*\n\n` +
        `¡Hola *${payload.clientName}*! 👋 Hemos registrado tu solicitud de reserva en *The Corner* (C.C. Costa Verde Planta Alta).\n\n` +
        `📋 *Detalles de tu Pase:*\n` +
        `• *Código:* #${payload.ticketCode || "CRN-0000"}\n` +
        `• *Paquete:* ${payload.planName || "Paquete de Celebración"}\n` +
        `• *Fecha & Hora:* ${payload.date} a las ${payload.time}\n` +
        `• *Personas:* ${payload.pax} invitados\n` +
        `• *Método:* ${(payload.paymentMethod || "Pago").toUpperCase()}\n` +
        (payload.paymentRef ? `• *Referencia:* #${payload.paymentRef}\n` : "") +
        `• *Monto:* $${payload.totalUSD?.toFixed(2)} USD\n\n` +
        `⏳ *Estado Actual:* _🟡 Verificando comprobante en gerencia._\n` +
        `Una vez verificado tu pago, recibirás la confirmación con tu pase QR 100% activo para ingresar en taquilla.\n\n` +
        `📍 *Ubicación:* ${SITE_CONFIG.address}`
      );

    case "PAYMENT_APPROVED":
      return (
        `🎉 *¡PAGO APROBADO & PASE QR ACTIVO! — THE CORNER*\n\n` +
        `¡Excelente noticia, *${payload.clientName}*! 🥳 Tu pago para *${payload.planName}* ha sido verificado y *APROBADO* por la gerencia de The Corner.\n\n` +
        `🎟️ *Tu Pase Digital Oficial:*\n` +
        `• *Ticket:* #${payload.ticketCode}\n` +
        `• *Fecha:* ${payload.date} (${payload.time})\n` +
        `• *Invitados:* ${payload.pax} personas\n` +
        `• *Mesa:* C.C. Costa Verde, Local PA-35-36 (Planta Alta)\n\n` +
        `🟢 *Estado:* *PASE ACTIVO PARA ACCESO INMEDIATO*\n` +
        `Presenta tu código QR en la entrada para recibir tus baldes de cortesía, narguiles y acceso a Mario Kart/Beerpong.\n\n` +
        `📍 *Abrir en Google Maps:* ${SITE_CONFIG.mapsUrl}\n` +
        `¡Te esperamos para celebrar como se debe! 🎂🍻`
      );

    case "PAYMENT_REJECTED":
      return (
        `⚠️ *[THE CORNER COSTA VERDE] NOVEDAD CON TU PAGO*\n\n` +
        `Estimado(a) *${payload.clientName}*,\n` +
        `Tuvimos un inconveniente al validar la referencia *#${payload.paymentRef || ""}* correspondiente al ticket *#${payload.ticketCode}*.\n\n` +
        `Por favor, reenvíanos la captura de tu comprobante bancario o el número de referencia corregido por este chat para activar tu pase de celebración de inmediato. 🙏`
      );

    case "ORDER_PLACED":
      let itemsList = "";
      payload.orderItems?.forEach((item) => {
        itemsList += `• ${item.quantity}x ${item.name} ($${(item.priceUSD * item.quantity).toFixed(2)})\n`;
      });
      return (
        `🍔 *[THE CORNER COSTA VERDE] COMANDA DIGITAL RECIBIDA*\n\n` +
        `*Cliente:* ${payload.clientName} (${payload.phone})\n` +
        `*Modalidad:* ${payload.orderType === "mesa" ? `En Mesa (${payload.tableNumber})` : "Para Llevar"}\n\n` +
        `*Ítems Solicitados:*\n${itemsList}\n` +
        `*Total:* $${payload.totalUSD?.toFixed(2)} USD\n` +
        (payload.customNotes ? `*Notas:* ${payload.customNotes}\n` : "") +
        `\n_¡Marchando a barra y cocina! 🔥_`
      );

    case "EVENT_REMINDER":
      return (
        `⏰ *¡HOY ES TU NOCHE EN THE CORNER! 🍻*\n\n` +
        `¡Hola *${payload.clientName}*! Te recordamos que hoy tienes tu mesa reservada (*#${payload.ticketCode}*) para *${payload.planName}* a las *${payload.time}*.\n\n` +
        `📍 *Llegada:* C.C. Costa Verde, Local PA-35-36, Planta Alta.\n` +
        `🚗 *Estacionamiento:* Disponible con vigilancia en el centro comercial.\n\n` +
        `¿Tienes alguna solicitud especial o cambio de hora? Escríbenos por aquí. ¡Nos vemos en breve! 🎮🍸`
      );

    default:
      return `¡Hola ${payload.clientName}! Mensaje oficial de The Corner Drinks & Entertainment.`;
  }
}

/**
 * Genera el enlace universal `https://wa.me/...` para despacho inmediato
 */
export function getWhatsAppDirectUrl(
  phone: string,
  message: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Servicio de envío automatizado por API (Meta Cloud API / Webhook externo)
 */
export async function sendAutomatedWhatsAppApi(
  payload: WhatsAppMessagePayload
): Promise<{ success: boolean; url: string }> {
  const message = buildWhatsAppTemplate(payload);
  const directUrl = getWhatsAppDirectUrl(payload.phone, message);

  // Si hay API configurada en variables de entorno, intenta despacho serverless
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  if (apiUrl && apiToken) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          to: payload.phone.replace(/[^0-9]/g, ""),
          message: message,
          template: payload.type,
        }),
      });

      if (res.ok) {
        return { success: true, url: directUrl };
      }
    } catch (e) {
      console.warn("Fallo despacho serverless de WhatsApp API, usando fallback directo:", e);
    }
  }

  return { success: true, url: directUrl };
}
