"use client";

import { motion } from "motion/react";
import {
  PartyPopper,
  Flame,
  Calendar,
  Gamepad2,
  Sparkles,
  MapPin,
  Beer,
  Crown,
  ChevronRight,
} from "lucide-react";

type Props = {
  onScrollToPackages: () => void;
  onScrollToMenu: () => void;
  onScrollToGames: () => void;
};

export function Hero({
  onScrollToPackages,
  onScrollToMenu,
  onScrollToGames,
}: Props) {
  return (
    <section className="relative min-h-[92dvh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden bg-radial-mesh">
      {/* Glows de ambientación inspirados en los flyers de The Corner */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Columna Izquierda: Copywriting con la energía y stickers de los flyers */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5">
            {/* Ubicación & Badge Oficial */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-orange-500/40 shadow-lg text-xs font-bold text-zinc-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-orange-400 font-extrabold uppercase">THE CORNER.</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-300">Maracaibo</span>
            </motion.div>

            {/* Sticker de Cumpleaños (Inspirado en el flyer 'El Cumpleañero No Paga') */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[11px] uppercase tracking-wider shadow-lg transform -rotate-1">
                🎂 ¡CELEBRA TU CUMPLEAÑOS — EL CUMPLEAÑERO NO PAGA!
              </span>
            </motion.div>

            {/* Titular Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] uppercase"
            >
              Celebra en <span className="text-gradient-corner">Corner</span>.{" "}
              <br className="hidden sm:inline" />
              Drinks, Narguiles & <span className="text-gradient-party">Rumba</span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              El punto de encuentro y entretenimiento de Maracaibo.
              Baldes de cerveza a $10, Beerpong, Mario Kart en pantalla gigante, narguiles, karaoke y los mejores paquetes para tus eventos.
            </motion.p>

            {/* Botones de Acción / CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2.5 pt-2"
            >
              <button
                onClick={onScrollToPackages}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#E04B00] hover:from-[#FF6611] hover:to-[#FF5500] text-black font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-orange-500/30 active:scale-[0.97] transition-transform"
              >
                <PartyPopper className="w-4 h-4 text-black" />
                <span>VER PAQUETES CON QR (DESDE $50)</span>
              </button>

              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <button
                  onClick={onScrollToMenu}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-orange-500 text-white font-bold text-xs active:scale-[0.97] transition-all"
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>PROMOS $10</span>
                </button>

                <button
                  onClick={onScrollToGames}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 font-bold text-xs active:scale-[0.97] transition-all"
                >
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  <span>MARIO KART</span>
                </button>
              </div>
            </motion.div>

            {/* Highlights de Promos Reales */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-left"
            >
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] font-black uppercase text-orange-400 block">
                  🍺 TODA LA NOCHE
                </span>
                <span className="text-xs font-extrabold text-white">
                  10$ Balde 10 Cervezas
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  Mié, Jue y Dom
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] font-black uppercase text-pink-400 block">
                  🍸 HAPPY HOUR 2X1
                </span>
                <span className="text-xs font-extrabold text-white">
                  Cócteles de Selección
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  Vie y Sáb (8PM a 11PM)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-black uppercase text-purple-400 block">
                  🎮 MARIO KART & BEERPONG
                </span>
                <span className="text-xs font-extrabold text-white">
                  Pantalla Gigante
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  Torneos & Retos
                </span>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Tarjeta / Flyer de Paquetes de Celebración */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-md rounded-3xl border border-orange-500/40 bg-gradient-to-b from-[#14141d] via-[#101018] to-[#0a0a0f] p-6 sm:p-7 shadow-2xl relative overflow-hidden glow-corner-orange"
            >
              {/* Badge Destacado */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-md">
                  PAQUETES DE CELEBRACIÓN
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  CUMPLEAÑOS & EVENTOS
                </span>
              </div>

              <div className="space-y-3 my-4">
                {/* Paquete 1 Promo */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-orange-500/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">
                        PAQUETE 1 (5 Personas)
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Balde + 5 Cócteles + Tequeños + Papas + Narguile + Beerpong
                    </p>
                  </div>
                  <span className="text-base font-black text-orange-400 shrink-0 ml-2">
                    $50
                  </span>
                </div>

                {/* Paquete 2 Promo */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-white">
                      PAQUETE 2 (10 Personas)
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      2 Baldes + 2 Pizzas + Tequeños + Shots Power Rangers + Narguile
                    </p>
                  </div>
                  <span className="text-base font-black text-amber-400 shrink-0 ml-2">
                    $70
                  </span>
                </div>

                {/* Paquete 3 Promo Mario Kart */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-black border border-purple-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-purple-300">
                      PAQUETE 3 PREMIUM (15 Pax)
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Balde + Sangría + Pizza + Mario Kart 4P + Narguile + Beerpong
                    </p>
                  </div>
                  <span className="text-base font-black text-pink-400 shrink-0 ml-2">
                    $85
                  </span>
                </div>
              </div>

              <button
                onClick={onScrollToPackages}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.97] transition-all"
              >
                <span>RESERVAR PAQUETE CON QR AHORA</span>
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
