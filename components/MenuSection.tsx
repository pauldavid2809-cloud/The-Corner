"use client";

import { useState } from "react";
import { MenuItem, MENU_ITEMS } from "@/data/cornerData";
import { CurrencyMode, formatPrice } from "@/data/currencies";
import {
  Sparkles,
  Flame,
  Plus,
  Check,
  ShoppingBag,
  Info,
  Beer,
  Utensils,
  Coffee,
  IceCream,
} from "lucide-react";

type Props = {
  currency: CurrencyMode;
  bcvRate: number;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuSection({ currency, bcvRate, onAddToCart }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("pociones");
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const categories = [
    { id: "pociones", label: "Pociones & Tragos UV", icon: Sparkles },
    { id: "cervezas-shots", label: "Cervezas & Baldes", icon: Beer },
    { id: "munchies", label: "Burgers & Munchies", icon: Utensils },
    { id: "mocktails-cafe", label: "Sin Alcohol & Café", icon: Coffee },
    { id: "postres", label: "Postres Gamer", icon: IceCream },
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
    <section id="menu" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#09090E] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Carta & Mixología Temática
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pociones Mágicas, Tragos & Munchies
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Cócteles que brillan bajo luz negra UV, hamburguesas de carne Angus certificada, volcanes de nachos para compartir y bebidas sin alcohol.
          </p>

          {/* Banner de Moneda */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs text-zinc-300">
            <Info className="w-3.5 h-3.5 text-orange-400" />
            <span>
              Precios mostrados en{" "}
              <strong className="text-white">
                {currency === "USD" ? "Dólares ($ USD)" : "Bolívares (VES al cambio BCV)"}
              </strong>
            </span>
          </div>
        </div>

        {/* Categorías / Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/25 scale-105"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de Ítems del Menú */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => {
            const isAdded = addedItemId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 group"
              >
                <div className="space-y-3">
                  {/* Badge & Popularidad */}
                  <div className="flex items-center justify-between gap-2">
                    {item.badge ? (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        The Corner
                      </span>
                    )}

                    {item.spicy && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Flameado
                      </span>
                    )}
                  </div>

                  {/* Nombre del Plato / Bebida */}
                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors leading-snug">
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
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Precio y Botón Agregar */}
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                      Precio
                    </span>
                    <span className="text-lg font-black text-white">
                      {formatPrice(item.priceUSD, currency, bcvRate)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
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
                        <span>Añadir</span>
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
