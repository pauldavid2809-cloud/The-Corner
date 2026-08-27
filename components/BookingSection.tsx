"use client";

import { useState } from "react";
import { BookingPlan, BOOKING_PLANS } from "@/data/cornerData";
import { CurrencyMode, formatPrice } from "@/data/currencies";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Crown,
} from "lucide-react";

export type BookingData = {
  plan: BookingPlan;
  date: string;
  time: string;
  pax: number;
  name: string;
  phone: string;
  notes: string;
  totalUSD: number;
};

type Props = {
  currency: CurrencyMode;
  bcvRate: number;
  onGenerateQrTicket: (bookingData: BookingData) => void;
};

export function BookingSection({
  currency,
  bcvRate,
  onGenerateQrTicket,
}: Props) {
  const [selectedPlan, setSelectedPlan] = useState<BookingPlan>(BOOKING_PLANS[0]);
  const [selectedDate, setSelectedDate] = useState<string>("Hoy");
  const [selectedTime, setSelectedTime] = useState<string>("07:30 PM");
  const [pax, setPax] = useState<number>(4);
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientNotes, setClientNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const dateOptions = ["Hoy", "Mañana", "Viernes", "Sábado", "Domingo"];
  const timeSlots = [
    "05:30 PM",
    "06:30 PM",
    "07:30 PM",
    "08:30 PM",
    "09:30 PM",
    "10:30 PM",
  ];

  const totalUSD = selectedPlan.priceUSD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg("Por favor, ingresa tu nombre completo.");
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMsg("Por favor, ingresa tu número de teléfono / WhatsApp.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onGenerateQrTicket({
        plan: selectedPlan,
        date: selectedDate,
        time: selectedTime,
        pax,
        name: clientName,
        phone: clientPhone,
        notes: clientNotes,
        totalUSD,
      });
    }, 400);
  };

  return (
    <section id="reservas" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#0c0c12] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <QrCode className="w-4 h-4" />
            Sistema de Reservas con Pase QR
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Reserva tu Mesa o Salón VIP
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Asegura tu lugar sin esperas, obtén tu pase digital interactivo con código QR y abona el monto directamente a tu consumo en mesa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Selección de Plan */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Crown className="w-4 h-4 text-orange-400" />
              1. Selecciona tu Tipo de Mesa o Experiencia
            </h3>

            <div className="grid gap-3.5">
              {BOOKING_PLANS.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan);
                      if (plan.maxCapacity && pax > plan.maxCapacity) {
                        setPax(plan.maxCapacity);
                      }
                    }}
                    className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-500/15 via-zinc-900 to-zinc-900 border-orange-500 shadow-lg shadow-orange-500/10 scale-[1.01]"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-black text-white">
                            {plan.name}
                          </h4>
                          {plan.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-orange-400 block">
                          {formatPrice(plan.priceUSD, currency, bcvRate)}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {plan.unit}
                        </span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="mt-3 pt-3 border-t border-white/5 grid sm:grid-cols-2 gap-1.5">
                      {plan.features.slice(0, 4).map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[11px] text-zinc-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Selector de Fecha, Hora, PAX y Datos */}
          <div className="lg:col-span-5 space-y-6 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              2. Detalles de Asistencia & Contacto
            </h3>

            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">
                Día de la Reserva:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {dateOptions.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedDate === date
                        ? "bg-orange-500 text-black border-orange-500 shadow-md shadow-orange-500/20"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Hora */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Hora de Llegada:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === time
                        ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Personas (PAX) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  Número de Invitados:
                </span>
                <span className="text-orange-400 font-extrabold text-sm">
                  {pax} personas
                </span>
              </div>
              <input
                type="range"
                min="2"
                max={selectedPlan.maxCapacity || 15}
                value={pax}
                onChange={(e) => setPax(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Mín. 2</span>
                <span>Máx. {selectedPlan.maxCapacity || 15} pax</span>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Tu Nombre y Apellido:
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Carlos Mendoza"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  WhatsApp de Contacto:
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ej. +58 414 1234567"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Notas Especiales o Juegos Favoritos (Opcional):
                </label>
                <input
                  type="text"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Ej. Cumpleaños, queremos jugar Catan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {errorMsg}
              </p>
            )}

            {/* Resumen & Botón Generar Pase QR */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Abono Total Requerido:</span>
                <span className="text-base font-black text-white">
                  {formatPrice(totalUSD, currency, bcvRate)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-sm tracking-wide shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5 text-black" />
                {isSubmitting ? "GENERANDO PASE..." : "GENERAR PASE DIGITAL CON QR"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirmación instantánea sin comisiones intermediarias</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
