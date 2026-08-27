"use client";

import { WEEKLY_EVENTS, WeeklyEvent } from "@/data/cornerData";
import {
  Calendar,
  Clock,
  Trophy,
  Sparkles,
  PartyPopper,
  Mic2,
  Beer,
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
        return <Sparkles className="w-6 h-6 text-pink-400" />;
      case "PartyPopper":
        return <PartyPopper className="w-6 h-6 text-purple-400" />;
      case "Beer":
        return <Beer className="w-6 h-6 text-yellow-400" />;
      default:
        return <Calendar className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <section id="eventos" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#08080c] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black uppercase tracking-wider">
            <PartyPopper className="w-4 h-4" />
            CRONOGRAMA DE LA SEMANA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Noches Temáticas & Watch Parties
          </h2>
          <p className="text-sm sm:text-base text-zinc-300">
            Baldes a $10 los miércoles y domingos, noches de despecho los jueves, Happy Hour 2x1 los viernes y watch parties en pantalla gigante.
          </p>
        </div>

        {/* Grid de Eventos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WEEKLY_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="rounded-3xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-pink-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/5 group relative overflow-hidden"
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

                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-zinc-800 text-pink-300 border border-zinc-700">
                    {evt.badge}
                  </span>
                </div>

                {/* Título & Subtítulo */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white group-hover:text-pink-300 transition-colors leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-300">
                    {evt.subtitle}
                  </p>
                </div>

                {/* Descripción */}
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {evt.description}
                </p>

                {/* Promo Box */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 flex items-start gap-2 text-xs text-orange-200">
                  <Gift className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] font-bold leading-snug">
                    {evt.perk}
                  </span>
                </div>
              </div>

              {/* Botón Reservar */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => onSelectEventToBook(evt)}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 text-white group-hover:text-black font-black text-xs transition-all flex items-center justify-center gap-1.5"
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
