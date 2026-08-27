"use client";

import { motion } from "motion/react";
import {
  Gamepad2,
  Sparkles,
  Calendar,
  Dices,
  Clock,
  MapPin,
  Flame,
  Award,
  Users,
} from "lucide-react";

type Props = {
  onScrollToLudoteca: () => void;
  onScrollToMenu: () => void;
  onScrollToBooking: () => void;
  onOpenDiceRoller: () => void;
};

export function Hero({
  onScrollToLudoteca,
  onScrollToMenu,
  onScrollToBooking,
  onOpenDiceRoller,
}: Props) {
  return (
    <section className="relative min-h-[95dvh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden bg-radial-grid">
      {/* Luces y ambientación de fondo (Cyber-Tavern Glows) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Columna Izquierda: Copywriting de Alto Impacto */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-orange-500/30 shadow-md backdrop-blur-sm text-xs font-semibold text-zinc-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-orange-400 font-bold">The Corner</span>
              <span className="text-zinc-500">·</span>
              <span>Maracaibo · Calle 72 con Av. 10</span>
            </motion.div>

            {/* Titular Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]"
            >
              Juegos de Mesa,{" "}
              <span className="text-gradient-orange">Pociones Mágicas</span> y la Mejor Vibra.
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              El punto de encuentro gamer y gastronómico de Maracaibo. Más de{" "}
              <strong className="text-white font-semibold">50 juegos de mesa</strong> guiados por Game Masters,
              tragos que brillan en la oscuridad, comedia en vivo y salones para eventos privados.
            </motion.p>

            {/* CTAs de Conversión */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
            >
              {/* Botón Principal: Reservar */}
              <button
                onClick={onScrollToBooking}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Calendar className="w-4 h-4" />
                Reservar Mesa con QR
              </button>

              {/* Botón Ludoteca */}
              <button
                onClick={onScrollToLudoteca}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-orange-500/50 text-white font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Gamepad2 className="w-4 h-4 text-orange-400" />
                Ver 50+ Juegos
              </button>

              {/* Botón Carta */}
              <button
                onClick={onScrollToMenu}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/80 border border-white/10 hover:border-amber-400/40 text-amber-300 font-semibold text-xs sm:text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Carta de Pociones
              </button>
            </motion.div>

            {/* Trust Badges & Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-2 text-left">
                <Award className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs text-zinc-300 font-medium leading-tight">
                  Game Masters incluidos
                </span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-zinc-300 font-medium leading-tight">
                  Sin límite de tiempo
                </span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs text-zinc-300 font-medium leading-tight">
                  Pociones con luz UV
                </span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <Users className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-zinc-300 font-medium leading-tight">
                  Eventos y torneos
                </span>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Tarjeta / Widget Interactivo "Tira el Dado D20" */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md rounded-3xl border border-orange-500/30 bg-gradient-to-b from-[#14141d] via-[#101017] to-[#0a0a0f] p-6 sm:p-7 shadow-2xl relative group overflow-hidden glow-orange"
            >
              {/* Resplandor superior */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all" />

              {/* Cabecera del Widget */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
                    <Dices className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                      Recomendador D20
                    </h2>
                    <p className="text-[11px] text-zinc-400">
                      ¿No sabes qué jugar hoy con tu grupo?
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  IA Gamer
                </span>
              </div>

              {/* Contenido Visual / Acción */}
              <div className="space-y-4 my-4">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Partida Rápida o Épica</span>
                    <span className="text-orange-400 font-bold">50+ Opciones</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">
                    Tira el dado de 20 caras virtual y nuestro selector inteligente te emparejará
                    con el juego perfecto según tus jugadores y tiempo.
                  </p>
                </div>

                {/* Banner Miniatura de Juego Destacado */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-3.5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black text-lg shrink-0">
                    🎲
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        Catan · Secret Hitler · Codenames
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      Desde duelos 1v1 hasta grupos de 10+
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de Tirar el Dado */}
              <button
                onClick={onOpenDiceRoller}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-sm tracking-wide shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Dices className="w-5 h-5 text-black animate-spin-slow" />
                TIRAR EL DADO D20 AHORA
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
