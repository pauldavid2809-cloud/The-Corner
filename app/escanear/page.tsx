"use client";

import { useState } from "react";
import { QRCodeScanner, ScanVerificationResult } from "@/components/QRCodeScanner";
import { fetchBookingsFromSupabase } from "@/lib/services";
import { INITIAL_LIVE_BOOKINGS, LiveBooking } from "@/data/cornerData";
import { Logo } from "@/components/Logo";
import { ShieldCheck, ArrowLeft, Users, QrCode } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const [redeemedCount, setRedeemedCount] = useState(0);

  const handleVerifyScan = async (code: string): Promise<ScanVerificationResult> => {
    try {
      const bookingsList = await fetchBookingsFromSupabase();
      const cleanTarget = code.trim().toLowerCase();

      const booking = bookingsList.find(
        (b) =>
          b.id.toLowerCase() === cleanTarget ||
          b.id.replace("CRN-", "").toLowerCase() === cleanTarget.replace("CRN-", "")
      );

      if (!booking) {
        return {
          success: false,
          status: "not_found",
          message: `El código #${code} no está registrado en el sistema de The Corner.`,
        };
      }

      // 1. Verificar si el pago fue aprobado
      if (booking.paymentStatus !== "aprobado" && booking.status !== "confirmada" && booking.status !== "en_mesa") {
        return {
          success: false,
          status: "payment_pending",
          message: `El pago de este pase aún está en verificación. Por favor pide al cliente su comprobante o valida con gerencia.`,
          booking,
        };
      }

      // 2. Verificar si ya fue canjeado / ingresado
      if (booking.status === "en_mesa") {
        return {
          success: true,
          status: "already_redeemed",
          message: `Este pase ya ingresó a sala. Ubicado en ${booking.tableNumber || "Mesa asignada"}.`,
          booking,
        };
      }

      // 3. Validar y autorizar ingreso
      setRedeemedCount((prev) => prev + 1);
      return {
        success: true,
        status: "approved",
        message: `¡Pase Verificado! Autorizar ingreso a ${booking.clientName} (${booking.pax} personas).`,
        booking: {
          ...booking,
          status: "en_mesa",
        },
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        status: "not_found",
        message: "Error de conexión al verificar el ticket.",
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 py-8 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center">
      {/* Glows de ambientación */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Cabecera del Validador */}
        <div className="flex items-center justify-between p-4 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-xl">
          <Link
            href="/"
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Inicio</span>
          </Link>

          <Logo size="sm" withText />

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase">
            Taquilla
          </span>
        </div>

        {/* Título & Estadísticas */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5" />
            <span>Control de Acceso en Puerta</span>
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Escáner de Pases QR
          </h1>
          <p className="text-xs text-zinc-400">
            Valida los pases de celebración, verifica pagos y autoriza ingresos en tiempo real.
          </p>
        </div>

        {/* Componente Escáner con Cámara */}
        <QRCodeScanner onScanSuccess={handleVerifyScan} />
      </div>
    </div>
  );
}
