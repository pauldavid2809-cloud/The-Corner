"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { BoardGame, BOARD_GAMES } from "@/data/cornerData";
import { Dices, X, Sparkles, Users, Clock, Flame, ChevronRight } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (game: BoardGame) => void;
};

export function DiceRollerModal({ isOpen, onClose, onSelectGame }: Props) {
  const [playerFilter, setPlayerFilter] = useState<number>(4);
  const [timeFilter, setTimeFilter] = useState<string>("cualquiera");
  const [isRolling, setIsRolling] = useState(false);
  const [diceNumber, setDiceNumber] = useState<number | null>(null);
  const [resultGame, setResultGame] = useState<BoardGame | null>(null);

  if (!isOpen) return null;

  const handleRollDice = () => {
    setIsRolling(true);
    setResultGame(null);

    // Animación de números rotando rápidamente
    let counter = 0;
    const interval = setInterval(() => {
      setDiceNumber(Math.floor(Math.random() * 20) + 1);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalNumber = Math.floor(Math.random() * 20) + 1;
        setDiceNumber(finalNumber);

        // Filtrar juegos compatibles
        let pool = BOARD_GAMES.filter(
          (g) => playerFilter >= g.minPlayers && playerFilter <= g.maxPlayers
        );

        if (timeFilter === "rapido") {
          pool = pool.filter((g) => g.minMinutes <= 30);
        } else if (timeFilter === "medio") {
          pool = pool.filter((g) => g.minMinutes > 20 && g.minMinutes <= 60);
        } else if (timeFilter === "epico") {
          pool = pool.filter((g) => g.minMinutes >= 60);
        }

        if (pool.length === 0) {
          pool = BOARD_GAMES;
        }

        const picked = pool[Math.floor(Math.random() * pool.length)];
        setResultGame(picked);
        setIsRolling(false);

        // Disparar confeti si saca un 20 crítico o cualquier número alto
        if (finalNumber >= 15) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#f97316", "#eab308", "#38bdf8", "#ffffff"],
          });
        }
      }
    }, 80);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-orange-500/30 bg-[#101016] p-6 sm:p-7 shadow-2xl glow-orange text-white"
        >
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Encabezado */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-2">
              <Dices className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">
              Tirada Crítica D20 — Selector IA
            </h3>
            <p className="text-xs text-zinc-400">
              Ajusta tu grupo, lanza el dado de 20 caras y descubre tu próxima aventura.
            </p>
          </div>

          {/* Filtros previos a la tirada */}
          <div className="space-y-4 mb-6">
            {/* Cantidad de Jugadores */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-400" />
                ¿Cuántos jugadores son en la mesa?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPlayerFilter(num)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      playerFilter === num
                        ? "bg-orange-500 text-black border-orange-500 shadow-md shadow-orange-500/25"
                        : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {num === 2 ? "2 (Duelo)" : num === 4 ? "3-4 Pax" : num === 6 ? "5-6 Pax" : "7+ Party"}
                  </button>
                ))}
              </div>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                ¿Cuánto tiempo quieren jugar?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "cualquiera", label: "Cualquiera" },
                  { id: "rapido", label: "< 30 min" },
                  { id: "medio", label: "30-60 min" },
                  { id: "epico", label: "60+ min" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTimeFilter(item.id)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      timeFilter === item.id
                        ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/25"
                        : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Área del Dado D20 animado */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/60 border border-white/10 mb-6">
            <div className="relative mb-3">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center text-black font-black text-3xl shadow-xl shadow-orange-500/30 transition-transform ${
                  isRolling ? "animate-spin scale-110" : "scale-100"
                }`}
              >
                {diceNumber ? diceNumber : "20"}
              </div>
              {diceNumber === 20 && (
                <span className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-yellow-400 text-black font-black text-[10px] uppercase shadow-md animate-bounce">
                  ¡CRÍTICO!
                </span>
              )}
            </div>

            <button
              onClick={handleRollDice}
              disabled={isRolling}
              className="mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-sm tracking-wider shadow-lg shadow-orange-500/30 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Dices className={`w-5 h-5 ${isRolling ? "animate-spin" : ""}`} />
              {isRolling ? "TIRANDO EL DADO..." : "LANZAR DADO D20"}
            </button>
          </div>

          {/* Resultado del Juego */}
          {resultGame && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 via-zinc-900 to-zinc-950 border border-orange-500/40 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    JUEGO RECOMENDADO
                  </span>
                  <h4 className="text-lg font-black text-white mt-1">
                    {resultGame.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span>👥 {resultGame.players}</span>
                    <span>·</span>
                    <span>⏱️ {resultGame.duration}</span>
                    <span>·</span>
                    <span className="text-amber-400 font-semibold">{resultGame.difficulty}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 line-clamp-2">
                {resultGame.description}
              </p>

              <button
                onClick={() => {
                  onSelectGame(resultGame);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-orange-500 text-white hover:text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Ver Ficha Completa & Reglas</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
