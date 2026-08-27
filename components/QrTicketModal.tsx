"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { BookingData } from "./BookingSection";
import { SITE_CONFIG } from "@/lib/config";
import { CurrencyMode, formatDualPrice } from "@/data/currencies";
import {
  X,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Share2,
  Download,
  MessageCircle,
  Sparkles,
  Gamepad2,
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
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      // Disparar confeti de celebración
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#f97316", "#eab308", "#38bdf8", "#10b981"],
      });

      // Generar código QR en canvas
      if (canvasRef.current) {
        const qrContent = JSON.stringify({
          ticket: ticketCode,
          name: booking.name,
          plan: booking.plan.name,
          pax: booking.pax,
          date: booking.date,
          time: booking.time,
          totalUSD: booking.totalUSD,
          venue: "The Corner Maracaibo",
        });

        QRCode.toCanvas(
          canvasRef.current,
          qrContent,
          {
            width: 180,
            margin: 1.5,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          },
          (err) => {
            if (!err) setQrGenerated(true);
          }
        );
      }
    }
  }, [isOpen, booking, ticketCode]);

  if (!isOpen || !booking) return null;

  const dualPrice = formatDualPrice(booking.totalUSD, bcvRate);

  // Mensaje estructurado para WhatsApp
  const whatsappMsg =
    `🎟️ *[THE CORNER MARACAIBO] NUEVA RESERVA GAMER*\n\n` +
    `*Código:* #${ticketCode}\n` +
    `*Cliente:* ${booking.name}\n` +
    `*WhatsApp:* ${booking.phone}\n` +
    `*Experiencia:* ${booking.plan.name}\n` +
    `*Fecha & Hora:* ${booking.date} a las ${booking.time}\n` +
    `*Personas:* ${booking.pax} pax\n` +
    `*Abono Total:* ${dualPrice.usd} (≈ ${dualPrice.ves})\n` +
    (booking.notes ? `*Notas:* ${booking.notes}\n\n` : `\n`) +
    `_Pase digital validado con código QR oficial._`;

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
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border border-orange-500/40 bg-[#0E0E14] p-6 sm:p-7 shadow-2xl glow-orange text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Encabezado Éxito */}
          <div className="text-center space-y-1 mb-5">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">
              ¡Pase VIP Generado con Éxito!
            </h3>
            <p className="text-xs text-zinc-400">
              Presenta este código QR en la entrada o mesa al llegar
            </p>
          </div>

          {/* Tarjeta Visual de Boarding Pass Gamer */}
          <div className="overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-5 shadow-inner space-y-4">
            {/* Header del Ticket */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-black">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-sm text-white uppercase block leading-none">
                    The Corner
                  </span>
                  <span className="text-[10px] text-orange-400 font-semibold">
                    Calle 72 con Av. 10 · MCBO
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Pase Digital
                </span>
                <span className="font-mono text-xs font-black text-amber-400">
                  #{ticketCode}
                </span>
              </div>
            </div>

            {/* Datos del Cliente y Reserva */}
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
                  Abono Total
                </span>
                <span className="font-bold text-emerald-400">
                  {dualPrice.usd}
                </span>
              </div>
            </div>

            {/* Plan */}
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
              <span className="text-[10px] text-orange-300 uppercase font-bold block">
                Experiencia Seleccionada:
              </span>
              <span className="font-bold text-white block mt-0.5">
                {booking.plan.name}
              </span>
            </div>

            {/* Render del Código QR */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-black space-y-1">
              <canvas ref={canvasRef} className="rounded-lg max-w-full" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-600 uppercase">
                ESCANEABLE EN PUERTA · VALOR OFICIAL
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="mt-5 space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              ENVIAR CONFIRMACIÓN A WHATSAPP
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 transition-all text-center"
            >
              Cerrar y Volver a la WebApp
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
