"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { BookingData } from "./BookingSection";
import { SITE_CONFIG } from "@/lib/config";
import { formatDualPrice } from "@/data/currencies";
import { Logo } from "@/components/Logo";
import {
  X,
  CheckCircle2,
  Calendar,
  Users,
  MessageCircle,
  PartyPopper,
  CreditCard,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingData | null;
  bcvRate: number;
};

export function QrTicketModal({
  isOpen,
  onClose,
  booking,
  bcvRate,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ticketCode] = useState<string>(
    () => `CRN-${Math.floor(1000 + Math.random() * 9000)}`
  );

  useEffect(() => {
    if (isOpen && booking) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#ff5500", "#ec4899", "#8b5cf6", "#f59e0b", "#10b981"],
      });

      if (canvasRef.current) {
        const qrContent = JSON.stringify({
          ticket: ticketCode,
          name: booking.name,
          plan: booking.plan.name,
          pax: booking.pax,
          date: booking.date,
          time: booking.time,
          totalUSD: booking.totalUSD,
          paymentMethod: booking.paymentMethod,
          ref: booking.paymentReference || "En Puerta",
          status: booking.paymentStatus,
          venue: "The Corner Drinks & Entertainment",
        });

        QRCode.toCanvas(
          canvasRef.current,
          qrContent,
          {
            width: 160,
            margin: 1.5,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          },
          (err) => {
            if (err) console.error(err);
          }
        );
      }
    }
  }, [isOpen, booking, ticketCode]);

  if (!isOpen || !booking) return null;

  const dualPrice = formatDualPrice(booking.totalUSD, bcvRate);

  const whatsappMsg =
    `🎟️ *[THE CORNER] NUEVO REPORTE DE PAGO & RESERVA*\n\n` +
    `*Código:* #${ticketCode}\n` +
    `*Anfitrión/Cliente:* ${booking.name}\n` +
    `*WhatsApp:* ${booking.phone}\n` +
    `*Paquete:* ${booking.plan.name}\n` +
    `*Fecha & Hora:* ${booking.date} a las ${booking.time}\n` +
    `*Personas:* ${booking.pax} pax\n` +
    `*Método de Pago:* ${booking.paymentMethod.toUpperCase()}\n` +
    (booking.paymentReference
      ? `*N° Referencia:* #${booking.paymentReference} ${
          booking.paymentBank ? `(${booking.paymentBank})` : ""
        }\n`
      : `*Pago:* Efectivo en Puerta\n`) +
    `*Total / Inversión:* ${dualPrice.usd} (≈ ${dualPrice.ves})\n` +
    (booking.notes ? `*Detalles:* ${booking.notes}\n\n` : `\n`) +
    `_Pase de celebración con código QR oficial para validación y conciliación._`;

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    whatsappMsg
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Boarding Pass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border border-orange-500/40 bg-[#0E0E14] p-6 sm:p-7 shadow-2xl glow-corner-orange text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Encabezado Éxito & Estado del Pago */}
          <div className="text-center space-y-1 mb-5">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">
              ¡Pago Reportado con Éxito!
            </h3>
            <p className="text-xs text-zinc-400">
              Tu pase QR está en proceso de validación por la gerencia de The Corner
            </p>
          </div>

          {/* Tarjeta Visual de Boarding Pass */}
          <div className="overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-5 shadow-inner space-y-4">
            {/* Header del Ticket */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <Logo withText size="sm" />

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  PASE OFICIAL
                </span>
                <span className="font-mono text-xs font-black text-amber-400">
                  #{ticketCode}
                </span>
              </div>
            </div>

            {/* Estado del Pago Badge */}
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-300 font-bold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                Estado del Pago:
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black uppercase">
                🟡 Verificando Referencia
              </span>
            </div>

            {/* Datos */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Titular
                </span>
                <span className="font-bold text-white truncate block">
                  {booking.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Invitados
                </span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  {booking.pax} personas
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Fecha & Hora
                </span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  {booking.date} · {booking.time}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Total Reportado
                </span>
                <span className="font-bold text-emerald-400">
                  {dualPrice.usd}
                </span>
              </div>
            </div>

            {/* Método y Referencia */}
            {booking.paymentReference && (
              <div className="p-2 rounded-lg bg-black/60 border border-white/5 text-[11px] flex items-center justify-between">
                <span className="text-zinc-400">
                  {booking.paymentMethod.toUpperCase()}:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  Ref: #{booking.paymentReference}
                </span>
              </div>
            )}

            {/* Paquete */}
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
              <span className="text-[10px] text-orange-300 uppercase font-bold block">
                Paquete Seleccionado:
              </span>
              <span className="font-bold text-white block mt-0.5">
                {booking.plan.name}
              </span>
            </div>

            {/* Render del Código QR */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-black space-y-1">
              <canvas ref={canvasRef} className="rounded-lg max-w-full" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-600 uppercase">
                VALIDACIÓN EN PUERTA · MARACAIBO
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="mt-5 space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.97] transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              ENVIAR COMPROBANTE POR WHATSAPP
            </a>

            <a
              href={`/ticket/${ticketCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-orange-500/40 text-xs font-bold text-orange-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Pase Completo para Compartir o Imprimir</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-black/40 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all text-center"
            >
              Cerrar y Continuar Navegando
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
