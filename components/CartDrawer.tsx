"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MenuItem } from "@/data/cornerData";
import { CurrencyMode, formatPrice, formatDualPrice } from "@/data/currencies";
import { SITE_CONFIG } from "@/lib/config";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Heart,
  Sparkles,
  MapPin,
  Utensils,
  Check,
  Zap,
} from "lucide-react";

export type CartItem = {
  item: MenuItem;
  quantity: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyMode;
  bcvRate: number;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onClearCart: () => void;
};

export function CartDrawer({
  isOpen,
  onClose,
  items,
  currency,
  bcvRate,
  onUpdateQuantity,
  onClearCart,
}: Props) {
  const [orderType, setOrderType] = useState<"mesa" | "pickup" | "reserva">("mesa");
  const [tableNumber, setTableNumber] = useState<string>("Mesa 4");
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [notes, setNotes] = useState<string>("");

  if (!isOpen) return null;

  const totalQuantity = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotalUSD = items.reduce(
    (acc, curr) => acc + curr.item.priceUSD * curr.quantity,
    0
  );

  const tipUSD = (subtotalUSD * tipPercentage) / 100;
  const totalUSD = subtotalUSD + tipUSD;
  const totalDual = formatDualPrice(totalUSD, bcvRate);
  const subtotalDual = formatDualPrice(subtotalUSD, bcvRate);

  const handleCheckoutWhatsApp = () => {
    let orderDetails = `🍔 *[THE CORNER] NUEVA COMANDA DIGITAL*\n\n`;
    orderDetails += `*Ubicación / Tipo:* ${
      orderType === "mesa"
        ? `Consumo en Mesa (${tableNumber || "Por Asignar"})`
        : orderType === "pickup"
        ? `Para Llevar / Pick-Up en Barra`
        : `Consumo para Reserva Especial`
    }\n\n`;

    orderDetails += `*Productos Pedidos:*\n`;
    items.forEach((ci) => {
      const itemSubtotal = ci.item.priceUSD * ci.quantity;
      orderDetails += `• ${ci.quantity}x ${ci.item.name} ($${itemSubtotal.toFixed(2)})\n`;
    });

    orderDetails += `\n*Subtotal:* $${subtotalUSD.toFixed(2)} USD\n`;
    if (tipPercentage > 0) {
      orderDetails += `*Propina al Staff (${tipPercentage}%):* $${tipUSD.toFixed(2)} USD\n`;
    }
    orderDetails += `*TOTAL FINAL:* ${totalDual.usd} (≈ ${totalDual.ves})\n`;

    if (notes.trim()) {
      orderDetails += `\n*Instrucciones / Notas:* ${notes.trim()}\n`;
    }

    orderDetails += `\n_The Corner · Drinks & Entertainment · Maracaibo._`;

    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
      orderDetails
    )}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop con desenfoque de fondo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Panel del Carrito / Bottom Sheet en Móviles & Drawer en Desktop */}
        <div className="fixed inset-y-0 right-0 max-w-full flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="w-screen max-w-md bg-[#0A0A10] border-l border-orange-500/25 shadow-2xl flex flex-col justify-between h-full text-zinc-100"
          >
            {/* Header de la Comanda */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-950/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Comanda Digital
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {totalQuantity} {totalQuantity === 1 ? "producto" : "productos"} en total
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    title="Vaciar comanda"
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 active:scale-95 transition-all text-xs"
                    aria-label="Vaciar comanda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition-all"
                  aria-label="Cerrar comanda"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lista de Ítems y Modificadores */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {items.length > 0 ? (
                <>
                  {/* Lista de Productos */}
                  <div className="space-y-2.5">
                    {items.map(({ item, quantity }) => {
                      const itemTotal = item.priceUSD * quantity;
                      const itemDual = formatDualPrice(itemTotal, bcvRate);
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 flex items-center justify-between gap-3 shadow-lg hover:border-zinc-700 transition-all"
                        >
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-2">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-orange-400">
                                ${itemTotal.toFixed(2)} USD
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                (≈ {itemDual.ves})
                              </span>
                            </div>
                          </div>

                          {/* Stepper Táctil */}
                          <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/10 shrink-0">
                            <button
                              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-xs active:scale-90 transition-transform"
                              aria-label="Restar uno"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black text-white w-6 text-center font-mono">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-black flex items-center justify-center font-black active:scale-90 transition-transform"
                              aria-label="Sumar uno"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Configuración del Pedido (Modalidad, Mesa, Propina, Notas) */}
                  <div className="p-4 rounded-3xl bg-zinc-950 border border-white/5 space-y-4">
                    {/* Modalidad */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                        Modalidad del Pedido:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "mesa", label: "🪑 En Mesa" },
                          { id: "pickup", label: "🛍️ Pick-Up" },
                          { id: "reserva", label: "🎟️ Reserva" },
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() =>
                              setOrderType(mode.id as "mesa" | "pickup" | "reserva")
                            }
                            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                              orderType === mode.id
                                ? "bg-orange-500 text-black font-black shadow-md shadow-orange-500/20"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ubicación / Número de Mesa */}
                    {orderType === "mesa" && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-300 block">
                          Número o Nombre de la Mesa:
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Ej. Mesa 4 / Terraza / VIP"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Selector de Propina al Staff */}
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <Heart className="w-3.5 h-3.5 text-pink-400" />
                          Propina al Staff:
                        </span>
                        {tipPercentage > 0 && (
                          <span className="text-[11px] font-bold text-amber-400">
                            +${tipUSD.toFixed(2)} USD
                          </span>
                        )}
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[0, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setTipPercentage(pct)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                              tipPercentage === pct
                                ? "bg-amber-500 text-black font-black shadow-md shadow-amber-500/20"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {pct === 0 ? "0%" : `${pct}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notas para Cocina / Barra */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 block">
                        Instrucciones para la barra / cocina:
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Balde bien frío, salsa tártara aparte..."
                        className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-24 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                    <ShoppingBag className="w-8 h-8 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase">
                      Tu comanda está vacía
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1 leading-relaxed">
                      Explora el menú y añade baldes de cerveza a $10, narguiles, burgers o combos en un clic.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Resumen de Totales y Botón WhatsApp */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-zinc-950 space-y-3">
                {/* Desglose sin desbordamientos */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Subtotal ({totalQuantity} ítems):</span>
                    <span className="font-mono font-bold text-white">
                      ${subtotalUSD.toFixed(2)} USD
                    </span>
                  </div>

                  {tipPercentage > 0 && (
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Propina al staff ({tipPercentage}%):</span>
                      <span className="font-mono font-bold text-amber-400">
                        +${tipUSD.toFixed(2)} USD
                      </span>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-white block">
                        TOTAL A PAGAR:
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        Tasa BCV: {bcvRate.toFixed(2)} Bs.
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg sm:text-xl font-black text-orange-400 block leading-tight">
                        {totalDual.usd}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-amber-300 block">
                        ≈ {totalDual.ves}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón WhatsApp */}
                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>ENVIAR PEDIDO A WHATSAPP</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
