"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BoardGame } from "@/data/cornerData";
import { X, Users, Clock, Flame, BookOpen, Sparkles, Check, HelpCircle } from "lucide-react";

type Props = {
  game: BoardGame | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestAtTable: (game: BoardGame, tableNum: string) => void;
};

export function GameDetailModal({
  game,
  isOpen,
  onClose,
  onRequestAtTable,
}: Props) {
  const [tableInput, setTableInput] = useState<string>("Mesa 4");
  const [isRequested, setIsRequested] = useState(false);

  if (!isOpen || !game) return null;

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestAtTable(game, tableInput);
    setIsRequested(true);
    setTimeout(() => {
      setIsRequested(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-orange-500/30 bg-[#0f0f15] p-6 sm:p-7 shadow-2xl glow-orange text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges y Categoría */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500 text-black">
              {game.category}
            </span>
            {game.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {game.badge}
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {game.name}
          </h3>

          {/* Métricas Rápidas */}
          <div className="grid grid-cols-3 gap-2 my-4">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 text-center">
              <Users className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <span className="text-[10px] text-zinc-400 block">Jugadores</span>
              <span className="text-xs font-bold text-white">{game.players}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 text-center">
              <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-zinc-400 block">Duración</span>
              <span className="text-xs font-bold text-white">{game.duration}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 text-center">
              <Flame className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <span className="text-[10px] text-zinc-400 block">Dificultad</span>
              <span className="text-xs font-bold text-white">{game.difficulty}</span>
            </div>
          </div>

          {/* Sinopsis */}
          <div className="space-y-4 my-4">
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Sinopsis del Juego
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Reglas Rápidas */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Cómo se Juega (Resumen Express)
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {game.rulesSummary}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[11px] font-medium text-zinc-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Formulario / Acción: Pedir a la mesa */}
          <form
            onSubmit={handleRequest}
            className="pt-4 border-t border-white/10 space-y-3"
          >
            {isRequested ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 text-xs font-bold">
                <Check className="w-4 h-4" />
                ¡Solicitud enviada al Game Master para {tableInput}!
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    value={tableInput}
                    onChange={(e) => setTableInput(e.target.value)}
                    placeholder="Mesa #"
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Pedir Juego a mi Mesa
                </button>
              </div>
            )}
            <p className="text-[10px] text-center text-zinc-500">
              ¿Dudas con las reglas? Un Game Master de The Corner se acercará a tu mesa a explicártelas paso a paso.
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
