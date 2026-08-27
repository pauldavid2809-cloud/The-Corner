"use client";

import { WEEKLY_EVENTS, WeeklyEvent } from "@/data/cornerData";
import {
  Calendar,
  Clock,
  Trophy,
  Sparkles,
  PartyPopper,
  Mic2,
  Dice6,
  Gift,
  ArrowRight,
} from "lucide-react";

type Props = {
  onSelectEventToBook: (event: WeeklyEvent) => void;
};

export function EventsSection({ onSelectEventToBook }: Props) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Mic2":
        return <Mic2 className="w-6 h-6 text-orange-400" />;
      case "Trophy":
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-sky-400" />;
      case "PartyPopper":
        return <PartyPopper className="w-6 h-6 text-rose-400" />;
      case "Dice6":
        return <Dice6 className="w-6 h-6 text-purple-400" />;
      default:
        return <Calendar className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <section id="eventos" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#08080c] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            Agenda & Torneos Semanales
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Noches Temáticas de The Corner
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Cada noche tiene una vibra diferente: comedia en vivo los miércoles, torneos de estrategia los jueves, fiestas UV los viernes y rol D&D los domingos.
          </p>
        </div>

        {/* Grid de Eventos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WEEKLY_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="rounded-3xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-orange-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Cabecera del día */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-black/60 border border-white/10 group-hover:scale-105 transition-transform">
                      {getIcon(evt.icon)}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-orange-400 block">
                        {evt.day}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {evt.time}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {evt.badge}
                  </span>
                </div>

                {/* Título & Subtítulo */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs font-medium text-amber-300/90">
                    {evt.subtitle}
                  </p>
                </div>

                {/* Descripción */}
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {evt.description}
                </p>

                {/* Promo / Perk Box */}
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-2 text-xs text-orange-200">
                  <Gift className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] font-medium leading-snug">
                    {evt.perk}
                  </span>
                </div>
              </div>

              {/* Botón Reservar para este evento */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => onSelectEventToBook(evt)}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 group-hover:bg-orange-500 text-white group-hover:text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Reservar Mesa para {evt.day}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
