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
  Filter,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";

type Props = {
  onSelectGame: (game: BoardGame) => void;
  onOpenDiceRoller: () => void;
};

export function LudotecaSection({ onSelectGame, onOpenDiceRoller }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<BoardGameCategory>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [playerFilter, setPlayerFilter] = useState<string>("todos");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("todos");

  const categories: { id: BoardGameCategory; label: string; icon: string }[] = [
    { id: "todos", label: "Todos (50+)", icon: "🎲" },
    { id: "estrategia", label: "Estrategia", icon: "🏰" },
    { id: "party", label: "Party & Risas", icon: "🎉" },
    { id: "cooperativo", label: "Cooperativos", icon: "🤝" },
    { id: "rol-dnd", label: "Rol & D&D", icon: "🐉" },
    { id: "duelos-1v1", label: "Duelos 1v1", icon: "⚔️" },
    { id: "cartas-rapidas", label: "Cartas Rápidas", icon: "🃏" },
  ];

  const filteredGames = useMemo(() => {
    return BOARD_GAMES.filter((game) => {
      // Filtro por categoría
      if (selectedCategory !== "todos" && game.category !== selectedCategory) {
        return false;
      }

      // Filtro por búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = game.name.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        const matchesTags = game.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      // Filtro por jugadores
      if (playerFilter === "2") {
        if (game.minPlayers > 2 || game.maxPlayers < 2) return false;
      } else if (playerFilter === "3-4") {
        if (game.maxPlayers < 3 || game.minPlayers > 4) return false;
      } else if (playerFilter === "5+") {
        if (game.maxPlayers < 5) return false;
      }

      // Filtro por dificultad
      if (difficultyFilter !== "todos" && game.difficulty !== difficultyFilter) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, playerFilter, difficultyFilter]);

  return (
    <section id="ludoteca" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#0B0B10] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Encabezado de la Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              Ludoteca Digital Interactiva
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Catálogo de 50+ Juegos de Mesa
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
              Explora nuestra colección curada: desde clásicos familiares hasta duelos 1v1 y partidas de rol épicas. Todos con asesoría de nuestros Game Masters.
            </p>
          </div>

          {/* Botón de Tirada Rápida */}
          <button
            onClick={onOpenDiceRoller}
            className="self-center md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <Dices className="w-4 h-4" />
            ¿Indeciso? Tira el Dado D20
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="space-y-4">
          {/* Categorías (Pills con Scroll Horizontal) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? "bg-orange-500 text-black shadow-lg shadow-orange-500/25 scale-105"
                      : "bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Controles de Búsqueda y Filtros secundarios */}
          <div className="grid sm:grid-cols-12 gap-3">
            {/* Buscador */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por juego, temática (Catan, Espías, D&D, Cartas...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtro por Nº de Jugadores */}
            <div className="sm:col-span-3">
              <select
                value={playerFilter}
                onChange={(e) => setPlayerFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="todos">👥 Todos los Jugadores</option>
                <option value="2">2 Jugadores (Duelos)</option>
                <option value="3-4">3 a 4 Jugadores</option>
                <option value="5+">5+ Jugadores (Grupos)</option>
              </select>
            </div>

            {/* Filtro por Dificultad */}
            <div className="sm:col-span-3">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="todos">⚡ Todas las Dificultades</option>
                <option value="Principiante">Principiante (Fácil)</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Experto">Experto (Hardcore)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contador de Resultados */}
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>
            Mostrando <strong className="text-white">{filteredGames.length}</strong> de{" "}
            {BOARD_GAMES.length} juegos disponibles
          </span>
          {(selectedCategory !== "todos" ||
            searchQuery ||
            playerFilter !== "todos" ||
            difficultyFilter !== "todos") && (
            <button
              onClick={() => {
                setSelectedCategory("todos");
                setSearchQuery("");
                setPlayerFilter("todos");
                setDifficultyFilter("todos");
              }}
              className="text-orange-400 hover:underline font-semibold"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {/* Grid de Tarjetas de Juegos */}
        {filteredGames.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group cursor-pointer rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-orange-500/50 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Badge superior */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                      {game.category}
                    </span>
                    {game.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate max-w-[140px]">
                        {game.badge}
                      </span>
                    )}
                  </div>

                  {/* Nombre */}
                  <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {game.name}
                  </h3>

                  {/* Datos Clave */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 my-2.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      {game.players}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {game.duration}
                    </span>
                  </div>

                  {/* Descripción corta */}
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Footer de la tarjeta con Tags y CTA */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        game.difficulty === "Principiante"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : game.difficulty === "Intermedio"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {game.difficulty}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-orange-400 group-hover:underline flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Ver Ficha
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mx-auto">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              No se encontraron juegos con esos criterios
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Intenta cambiar los filtros o busca títulos conocidos como Catan, Codenames, Dixit o Exploding Kittens.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("todos");
                setSearchQuery("");
                setPlayerFilter("todos");
                setDifficultyFilter("todos");
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 text-black font-bold text-xs hover:bg-orange-600 transition-all"
            >
              Mostrar todos los juegos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
