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
  const [tableNumber, setTableNumber] = useState<string>("Mesa");
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [notes, setNotes] = useState<string>("");

  if (!isOpen) return null;

  const subtotalUSD = items.reduce(
    (acc, curr) => acc + curr.item.priceUSD * curr.quantity,
    0
  );

  const tipUSD = (subtotalUSD * tipPercentage) / 100;
  const totalUSD = subtotalUSD + tipUSD;

  const totalDual = formatDualPrice(totalUSD, bcvRate);

  const handleCheckoutWhatsApp = () => {
    let orderDetails = `🍔 *[THE CORNER] NUEVA COMANDA DIGITAL*\n\n`;
    orderDetails += `*Ubicación / Tipo:* ${
      orderType === "mesa"
        ? `Consumo en Mesa (${tableNumber})`
        : orderType === "pickup"
        ? `Para Llevar / Pick-Up`
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
      orderDetails += `\n*Notas:* ${notes.trim()}\n`;
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
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Drawer Panel con física iOS-like */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="w-screen max-w-md bg-[#0D0D14] border-l border-orange-500/20 shadow-2xl flex flex-col justify-between"
          >
            {/* Header del Carrito */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase">
                    Comanda Digital
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {items.reduce((a, c) => a + c.quantity, 0)} productos en total
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    title="Vaciar comanda"
                    className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-700 transition-all text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lista de Ítems */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {items.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-[11px] font-black text-orange-400">
                            {formatPrice(item.priceUSD, currency, bcvRate)}
                          </span>
                        </div>

                        {/* Controles de Cantidad */}
                        <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded-xl border border-white/10 shrink-0">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, quantity - 1)
                            }
                            className="w-5 h-5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-white w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, quantity + 1)
                            }
                            className="w-5 h-5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black flex items-center justify-center font-bold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Modificador de Modalidad */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Modalidad:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "mesa", label: "En Mesa" },
                          { id: "pickup", label: "Pick-Up" },
                          { id: "reserva", label: "Para Reserva" },
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() =>
                              setOrderType(
                                mode.id as "mesa" | "pickup" | "reserva"
                              )
                            }
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                              orderType === mode.id
                                ? "bg-orange-500 text-black border-orange-500 shadow-md"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400"
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {orderType === "mesa" && (
                      <div>
                        <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                          Ubicación de Mesa:
                        </label>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder="Ej. Mesa 4 (C.C. Costa Verde)"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    )}

                    {/* Selector de Propina */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        Propina al Staff:
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[0, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setTipPercentage(pct)}
                            className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              tipPercentage === pct
                                ? "bg-amber-500 text-black border-amber-500 font-black shadow-md"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400"
                            }`}
                          >
                            {pct === 0 ? "0%" : `${pct}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notas */}
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                        Notas para la Cocina / Barra:
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej. Cervezas vestidas de novia, salsa aparte..."
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Tu comanda está vacía
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                    Añade baldes de cerveza a $10, narguiles, perros calientes o hamburguesas en 1 clic.
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-black/60 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="font-bold text-white">
                      {formatPrice(subtotalUSD, currency, bcvRate)}
                    </span>
                  </div>
                  {tipPercentage > 0 && (
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Propina ({tipPercentage}%):</span>
                      <span className="font-bold text-amber-400">
                        {formatPrice(tipUSD, currency, bcvRate)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-black text-white pt-1 border-t border-white/5">
                    <span>TOTAL A PAGAR:</span>
                    <span className="text-orange-400 text-base">
                      {totalDual.usd}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-zinc-500">
                    ≈ {totalDual.ves}
                  </div>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.97] transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  ENVIAR PEDIDO A WHATSAPP
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
