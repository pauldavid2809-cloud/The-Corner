"use client";

import { useState, useMemo } from "react";
import { BoardGame, BOARD_GAMES, BoardGameCategory } from "@/data/cornerData";
import {
  Gamepad2,
  Search,
  Users,
  Clock,
  Sparkles,
  Flame,
  Dices,
  BookOpen,
} from "lucide-react";

type Props = {
  onSelectGame: (game: BoardGame) => void;
  onOpenDiceRoller: () => void;
};

export function LudotecaSection({ onSelectGame, onOpenDiceRoller }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<BoardGameCategory>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("" );

  const categories: { id: BoardGameCategory; label: string; icon: string }[] = [
    { id: "todos", label: "Todo el Entretenimiento", icon: "🔥" },
    { id: "videojuegos-arcade", label: "Mario Kart & Videojuegos", icon: "🎮" },
    { id: "beerpong-retos", label: "Beerpong & Retos", icon: "🍺" },
    { id: "party", label: "Jenga, Uno & Party", icon: "🎉" },
    { id: "estrategia", label: "Catan & Estrategia", icon: "🎲" },
  ];

  const filteredGames = useMemo(() => {
    return BOARD_GAMES.filter((game) => {
      if (selectedCategory !== "todos" && game.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = game.name.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        const matchesTags = game.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="juegos" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#0B0B10] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-black uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              ZONA DE ENTRETENIMIENTO & RETOS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Mario Kart, Beerpong & Juegos de Mesa
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl">
              Compite en pantalla gigante de Nintendo Switch, desafía a tus amigos en la mesa de Beerpong o pasa el rato con Jenga y juegos de mesa.
            </p>
          </div>

          <button
            onClick={onOpenDiceRoller}
            className="self-center md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <Dices className="w-4 h-4" />
            Tirar Dado D20 / Selector IA
          </button>
        </div>

        {/* Categorías con scroll suave en móviles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="group cursor-pointer rounded-3xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-purple-500/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {game.category}
                  </span>
                  {game.badge && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-orange-500 text-black">
                      {game.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {game.name}
                </h3>

                <div className="flex items-center gap-4 text-xs text-zinc-400 my-2.5">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    {game.players}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {game.duration}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {game.difficulty}
                </span>

                <span className="text-xs font-black text-purple-400 group-hover:underline flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Pedir a Mesa
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
