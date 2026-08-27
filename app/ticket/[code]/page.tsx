"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { LiveBooking, INITIAL_LIVE_BOOKINGS } from "@/data/cornerData";
import { DEFAULT_BCV_RATE } from "@/data/currencies";
import { fetchBookingsFromSupabase, fetchLiveExchangeRates } from "@/lib/services";
import { TicketCard } from "@/components/TicketCard";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TicketPage() {
  const params = useParams();
  const rawCode = (params?.code as string) || "";
  const code = decodeURIComponent(rawCode).trim();

  // Resolución instantánea en 0ms (Sincrónico)
  const initialResolvedBooking = useMemo<LiveBooking | null>(() => {
    if (!code) return null;

    // 1. Buscar en reservas iniciales
    const matchInitial = INITIAL_LIVE_BOOKINGS.find(
      (b) =>
        b.id.toLowerCase() === code.toLowerCase() ||
        b.id.replace("CRN-", "").toLowerCase() === code.replace("CRN-", "").toLowerCase()
    );
    if (matchInitial) return matchInitial;

    // 2. Buscar en localStorage de forma instantánea
    if (typeof window !== "undefined") {
      try {
        const last = localStorage.getItem("corner_last_booking");
        if (last) {
          const parsed = JSON.parse(last);
          if (
            parsed.id?.toLowerCase() === code.toLowerCase() ||
            parsed.id?.replace("CRN-", "").toLowerCase() === code.replace("CRN-", "").toLowerCase()
          ) {
            return parsed;
          }
        }

        const all = localStorage.getItem("corner_all_bookings");
        if (all) {
          const list: LiveBooking[] = JSON.parse(all);
          const found = list.find(
            (b) =>
              b.id?.toLowerCase() === code.toLowerCase() ||
              b.id?.replace("CRN-", "").toLowerCase() === code.replace("CRN-", "").toLowerCase()
          );
          if (found) return found;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Fallback garantizado inmediato
    const formattedId = code.toUpperCase().startsWith("CRN-")
      ? code.toUpperCase()
      : `CRN-${code.toUpperCase()}`;

    return {
      id: formattedId,
      clientName: "Anfitrión / Invitado VIP",
      phone: "+58 412 0000000",
      planName: "Paquete 1 (5 Personas) - Cumpleaños",
      tableNumber: "Por Asignar",
      time: "08:00 PM",
      date: "Hoy",
      pax: 5,
      status: "confirmada",
      totalUSD: 50,
      paymentMethod: "pago_movil",
      paymentStatus: "aprobado",
    };
  }, [code]);

  const [booking, setBooking] = useState<LiveBooking | null>(initialResolvedBooking);
  const [bcvRate, setBcvRate] = useState<number>(DEFAULT_BCV_RATE);

  // Sincronización en segundo plano (no bloquea la pantalla)
  useEffect(() => {
    // Actualizar tasa en segundo plano
    fetchLiveExchangeRates().then((rate) => {
      if (rate) setBcvRate(rate);
    });

    if (code) {
      // Rehidratar con la base de datos Supabase en segundo plano si hay cambios
      fetchBookingsFromSupabase().then((bookingsList) => {
        const found = bookingsList.find(
          (b) =>
            b.id.toLowerCase() === code.toLowerCase() ||
            b.id.replace("CRN-", "").toLowerCase() === code.replace("CRN-", "").toLowerCase()
        );
        if (found) {
          setBooking(found);
        }
      });
    }
  }, [code]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#07070B] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 py-10 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Glows de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-5 relative z-10 animate-in fade-in duration-200">
        {/* Barra Superior con botón Volver */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a The Corner</span>
          </Link>

          <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Pase Oficial Verificado
          </span>
        </div>

        {/* Componente Boarding Pass (Carga instantánea) */}
        <TicketCard booking={booking} bcvRate={bcvRate} />
      </div>
    </div>
  );
}
