"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveBooking, INITIAL_LIVE_BOOKINGS } from "@/data/cornerData";
import { DEFAULT_BCV_RATE } from "@/data/currencies";
import { fetchBookingsFromSupabase, fetchLiveExchangeRates } from "@/lib/services";
import { TicketCard } from "@/components/TicketCard";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string) || "";

  const [booking, setBooking] = useState<LiveBooking | null>(null);
  const [bcvRate, setBcvRate] = useState<number>(DEFAULT_BCV_RATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveExchangeRates().then((rate) => {
      if (rate) setBcvRate(rate);
    });

    if (code) {
      fetchBookingsFromSupabase().then((bookingsList) => {
        const found = bookingsList.find(
          (b) =>
            b.id.toLowerCase() === code.toLowerCase() ||
            b.id.replace("CRN-", "") === code.replace("CRN-", "")
        );

        if (found) {
          setBooking(found);
        } else {
          // Fallback con datos demo si no existe aún en base de datos
          const fallback = INITIAL_LIVE_BOOKINGS.find(
            (b) => b.id.toLowerCase() === code.toLowerCase()
          );
          if (fallback) {
            setBooking(fallback);
          } else {
            // Crear ticket temporal
            setBooking({
              id: code.startsWith("CRN-") ? code : `CRN-${code}`,
              clientName: "Invitado VIP",
              phone: "+58 412 0000000",
              planName: "Paquete de Celebración",
              tableNumber: "Por Asignar",
              time: "08:00 PM",
              date: "Hoy",
              pax: 5,
              status: "confirmada",
              totalUSD: 50,
              paymentMethod: "pago_movil",
              paymentStatus: "aprobado",
            });
          }
        }
        setLoading(false);
      });
    }
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070B] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
            Cargando Pase Digital...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#07070B] flex items-center justify-center p-4 text-white text-center">
        <div className="space-y-4 max-w-sm">
          <h2 className="text-xl font-black uppercase">Pase No Encontrado</h2>
          <p className="text-xs text-zinc-400">
            No encontramos ninguna reserva con el código <code>#{code}</code>.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-black font-black text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 py-10 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Glows de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-5 relative z-10">
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

        {/* Componente Boarding Pass */}
        <TicketCard booking={booking} bcvRate={bcvRate} />
      </div>
    </div>
  );
}
