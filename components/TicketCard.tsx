"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { LiveBooking } from "@/data/cornerData";
import { formatDualPrice } from "@/data/currencies";
import { Logo } from "@/components/Logo";
import { SITE_CONFIG } from "@/lib/config";
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Share2,
  Printer,
  Copy,
  Check,
  MapPin,
  Sparkles,
  PartyPopper,
  Gamepad2,
  Flame,
  Beer,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

type TicketCardProps = {
  booking: LiveBooking;
  bcvRate?: number;
};

export function TicketCard({ booking, bcvRate = 76.8 }: TicketCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const ticketUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/ticket/${booking.id}`
      : `https://the-corner-webapp.vercel.app/ticket/${booking.id}`;

  const dualPrice = formatDualPrice(booking.totalUSD, bcvRate);

  useEffect(() => {
    if (canvasRef.current) {
      const qrData = JSON.stringify({
        ticket: booking.id,
        client: booking.clientName,
        plan: booking.planName,
        pax: booking.pax,
        date: booking.date,
        time: booking.time,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        url: ticketUrl,
      });

      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 200,
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
  }, [booking, ticketUrl]);

  const shareText =
    `🎟️ *[THE CORNER] ENTRADA & PASE DIGITAL DE CELEBRACIÓN*\n\n` +
    `¡Hola ${booking.clientName}! Aquí tienes tu pase oficial con código QR:\n\n` +
    `🔑 *Código de Entrada:* #${booking.id}\n` +
    `🎂 *Paquete:* ${booking.planName}\n` +
    `👥 *Invitados:* ${booking.pax} personas\n` +
    `📅 *Fecha & Hora:* ${booking.date} a las ${booking.time}\n` +
    `🪑 *Mesa Asignada:* ${booking.tableNumber || "Zona VIP / Por Asignar"}\n` +
    `🟢 *Estado:* ${booking.paymentStatus === "aprobado" ? "PAGO APROBADO & QR ACTIVO" : "EN VERIFICACIÓN"}\n\n` +
    `👉 *Ver pase con QR interactivo:* ${ticketUrl}\n\n` +
    `_Presenta este pase al llegar a The Corner para ingresar y recibir tus consumos._`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ticketUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-3xl border border-orange-500/40 bg-gradient-to-b from-[#0F0F17] via-[#0A0A0F] to-black shadow-2xl transition-all hover:border-orange-500/60 print:border-black print:bg-white print:text-black">
      {/* Cabecera del Ticket */}
      <div className="relative bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-b border-white/10 p-5 text-white">
        <div className="flex items-center justify-between">
          <Logo size="sm" withText />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">
              PASE OFICIAL
            </span>
            <span className="font-mono text-xs sm:text-sm font-black text-amber-400">
              #{booking.id}
            </span>
          </div>
        </div>
      </div>

      {/* Cuerpo del Ticket */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Banner de Estado */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
            booking.paymentStatus === "aprobado" || booking.status === "confirmada"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              : booking.status === "en_mesa"
              ? "bg-sky-500/10 border-sky-500/40 text-sky-300"
              : "bg-amber-500/10 border-amber-500/40 text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {booking.paymentStatus === "aprobado" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : booking.status === "en_mesa" ? (
              <PartyPopper className="w-4 h-4 text-sky-400 shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-black uppercase text-[11px] block leading-none">
                {booking.paymentStatus === "aprobado"
                  ? "Pase Aprobado & QR Activo"
                  : booking.status === "en_mesa"
                  ? "Grupo En Mesa · Canjeado"
                  : "Pago en Verificación"}
              </span>
              <span className="text-[10px] text-zinc-400">
                {booking.paymentStatus === "aprobado"
                  ? "Acceso autorizado para taquilla"
                  : "Validando con gerencia"}
              </span>
            </div>
          </div>

          <span className="font-mono text-[11px] font-bold">
            {dualPrice.usd}
          </span>
        </div>

        {/* Datos Principales: Titular, Mesa e Invitados */}
        <div className="rounded-2xl bg-zinc-900/90 border border-white/5 p-4 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                Titular / Anfitrión
              </span>
              <span className="font-black text-sm text-white block">
                {booking.clientName}
              </span>
              <span className="text-xs text-zinc-400">{booking.phone}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                Mesa Asignada
              </span>
              <span className="font-black text-sm text-orange-400 block">
                {booking.tableNumber || "Por Asignar"}
              </span>
              <span className="text-[10px] text-zinc-400">{booking.pax} Invitados</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                Fecha & Hora
              </span>
              <span className="font-bold text-zinc-200">
                {booking.date} · {booking.time}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                Método de Pago
              </span>
              <span className="font-mono font-bold text-emerald-400 uppercase text-[11px]">
                {booking.paymentMethod?.replace("_", " ")}
                {booking.paymentReference ? ` (#${booking.paymentReference})` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Paquete Seleccionado */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-zinc-900 to-amber-500/10 border border-orange-500/30 text-left">
          <div className="flex items-center gap-1.5 text-orange-400 text-xs font-black uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paquete Seleccionado</span>
          </div>
          <p className="font-black text-sm text-white">{booking.planName}</p>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Incluye baldes de cerveza Polar, narguiles, piqueo de tequeños/papas y acceso a juegos/Mario Kart según tu plan.
          </p>
        </div>

        {/* Contenedor del Código QR */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white text-black space-y-2 shadow-inner border-2 border-orange-500/30">
          <canvas ref={canvasRef} className="rounded-lg max-w-full" />
          <div className="text-center">
            <span className="text-[10px] font-mono font-black tracking-widest text-zinc-800 uppercase block">
              CANJE OFICIAL EN PUERTA · #{booking.id}
            </span>
            <span className="text-[9px] text-zinc-500 font-medium block">
              Escanea para validar acceso
            </span>
          </div>
        </div>

        {/* Botones de Acción (Compartir, Copiar, Imprimir) */}
        <div className="pt-2 space-y-2 print:hidden">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir Pase por WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "¡Enlace Copiado!" : "Copiar Enlace"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-orange-400" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
