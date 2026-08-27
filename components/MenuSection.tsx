"use client";

import { useState } from "react";
import { MenuItem, MENU_ITEMS } from "@/data/cornerData";
import { CurrencyMode, formatPrice } from "@/data/currencies";
import {
  Flame,
  Plus,
  Check,
  Beer,
  Utensils,
  Sparkles,
  Zap,
} from "lucide-react";

type Props = {
  currency: CurrencyMode;
  bcvRate: number;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuSection({ currency, bcvRate, onAddToCart }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("combos-promos");
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const categories = [
    { id: "combos-promos", label: "🔥 Promos & Baldes 10$", icon: Zap },
    { id: "narguiles-shots", label: "💨 Narguiles & Shots", icon: Sparkles },
    { id: "baldes-cervezas", label: "🍺 Baldes de Cerveza", icon: Beer },
    { id: "cocteles-botellas", label: "🍸 Cócteles & Botellas", icon: Flame },
    { id: "comida-munchies", label: "🍔 Burgers, Perros & Munchies", icon: Utensils },
  ];

  const currentItems = MENU_ITEMS.filter(
    (item) => item.category === activeCategory
  );

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1200);
  };

  return (
    <section id="menu" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#09090e] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 text-orange-400" />
            CARTA & PROMOS DESTACADAS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Narguiles, Baldes 10$ & Munchies
          </h2>
          <p className="text-sm sm:text-base text-zinc-300">
            Baldes de 10 cervezas a $10, sesiones de narguile con carbón de coco, 2 perros por $5, 3 burgers por $15 y shots Power Rangers.
          </p>
        </div>

        {/* Categorías / Tabs con scroll suave en móviles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/25"
                    : "bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de Ítems */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentItems.map((item) => {
            const isAdded = addedItemId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-3xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-orange-500/40 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 group"
              >
                <div className="space-y-2.5">
                  {/* Badge & Popularidad */}
                  <div className="flex items-center justify-between gap-2">
                    {item.badge ? (
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-sm">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        THE CORNER
                      </span>
                    )}
                  </div>

                  {/* Nombre */}
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {item.name}
                  </h3>

                  {/* Descripción */}
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Precio y Botón Añadir */}
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                      Precio
                    </span>
                    <span className="text-lg font-black text-white">
                      {formatPrice(item.priceUSD, currency, bcvRate)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      isAdded
                        ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30 scale-105"
                        : "bg-orange-500 hover:bg-orange-600 text-black shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Agregado!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pedir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
