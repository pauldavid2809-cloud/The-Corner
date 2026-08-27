"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { MenuItem, MENU_ITEMS, BoardGame, BOARD_GAMES, PAYMENT_ACCOUNTS } from "@/data/cornerData";
import { CurrencyMode, DEFAULT_BCV_RATE, formatPrice, formatDualPrice } from "@/data/currencies";
import { fetchLiveExchangeRates } from "@/lib/services";
import { Logo } from "@/components/Logo";
import { SITE_CONFIG } from "@/lib/config";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Dices,
  Flame,
  Gamepad2,
  Minus,
  PartyPopper,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Trash2,
  Utensils,
  X,
  Zap,
  Beer,
  Check,
  Copy,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

type TableOrderItem = {
  item: MenuItem;
  quantity: number;
};

export default function TableOrderPage() {
  const params = useParams();
  const rawTable = (params?.table as string) || "1";
  const tableNumber = decodeURIComponent(rawTable).replace("mesa-", "").replace("mesa", "").trim();
  const displayTable = isNaN(Number(tableNumber))
    ? `Zona ${tableNumber.toUpperCase()}`
    : `Mesa ${tableNumber}`;

  const [currency, setCurrency] = useState<CurrencyMode>("USD");
  const [bcvRate, setBcvRate] = useState<number>(DEFAULT_BCV_RATE);
  const [activeCategory, setActiveCategory] = useState<string>("combos-promos");

  // Comanda de la mesa
  const [orderItems, setOrderItems] = useState<TableOrderItem[]>([]);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [orderSent, setOrderSent] = useState(false);

  // Modales interactivos
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [waiterCallSent, setWaiterCallSent] = useState(false);
  const [waiterReason, setWaiterReason] = useState("Atención general en mesa");

  const [isGamePickerOpen, setIsGamePickerOpen] = useState(false);
  const [selectedGameRequest, setSelectedGameRequest] = useState<BoardGame | null>(null);
  const [gameRequestSent, setGameRequestSent] = useState(false);

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveExchangeRates().then((rate) => {
      if (rate) setBcvRate(rate);
    });
  }, []);

  const categories = [
    { id: "combos-promos", label: "🔥 Promos & Baldes 10$", icon: Zap },
    { id: "baldes-cervezas", label: "🍺 Baldes de Cerveza", icon: Beer },
    { id: "narguiles-shots", label: "💨 Narguiles & Shots", icon: Sparkles },
    { id: "comida-munchies", label: "🍔 Burgers & Perros", icon: Utensils },
    { id: "cocteles-botellas", label: "🍸 Cócteles & Botellas", icon: Flame },
  ];

  const currentItems = MENU_ITEMS.filter((i) => i.category === activeCategory);

  // Cantidad total y totales en USD / Bs.
  const totalItemsCount = orderItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalUSD = orderItems.reduce((acc, i) => acc + i.item.priceUSD * i.quantity, 0);
  const dualTotal = formatDualPrice(subtotalUSD, bcvRate);

  const handleAddItem = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as TableOrderItem[]
    );
  };

  // Enviar comanda a la barra
  const handleSendOrderToBar = () => {
    if (orderItems.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: displayTable,
      items: orderItems.map((i) => ({
        name: i.item.name,
        quantity: i.quantity,
        priceUSD: i.item.priceUSD,
      })),
      subtotalUSD,
      subtotalVES: subtotalUSD * bcvRate,
      notes: orderNotes.trim() || undefined,
      status: "pendiente",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Guardar en localStorage para que el monitor KDS en vivo (/barra) lo reciba
    if (typeof window !== "undefined") {
      try {
        const currentKds = JSON.parse(localStorage.getItem("corner_live_kds_orders") || "[]");
        localStorage.setItem(
          "corner_live_kds_orders",
          JSON.stringify([newOrder, ...currentKds])
        );
      } catch (e) {
        console.error(e);
      }
    }

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ff5500", "#f59e0b", "#10b981"],
    });

    setOrderSent(true);
    setTimeout(() => {
      setOrderItems([]);
      setOrderNotes("");
      setIsOrderSummaryOpen(false);
      setOrderSent(false);
    }, 2500);
  };

  // Llamar al mesonero
  const handleSendWaiterCall = () => {
    const newAlert = {
      id: `CALL-${Date.now()}`,
      table: displayTable,
      type: "mesonero",
      reason: waiterReason,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (typeof window !== "undefined") {
      try {
        const currentAlerts = JSON.parse(localStorage.getItem("corner_live_alerts") || "[]");
        localStorage.setItem("corner_live_alerts", JSON.stringify([newAlert, ...currentAlerts]));
      } catch (e) {
        console.error(e);
      }
    }

    setWaiterCallSent(true);
    setTimeout(() => {
      setIsCallWaiterOpen(false);
      setWaiterCallSent(false);
    }, 2000);
  };

  // Pedir juego de mesa
  const handleSendGameRequest = (game: BoardGame) => {
    const newAlert = {
      id: `GAME-${Date.now()}`,
      table: displayTable,
      type: "juego",
      gameName: game.name,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (typeof window !== "undefined") {
      try {
        const currentAlerts = JSON.parse(localStorage.getItem("corner_live_alerts") || "[]");
        localStorage.setItem("corner_live_alerts", JSON.stringify([newAlert, ...currentAlerts]));
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedGameRequest(game);
    setGameRequestSent(true);
    setTimeout(() => {
      setIsGamePickerOpen(false);
      setGameRequestSent(false);
      setSelectedGameRequest(null);
    }, 2000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 pb-28 sm:pb-24">
      {/* Barra Superior con Ubicación de la Mesa */}
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-orange-500/30 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" withText />
            <span className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-black text-xs uppercase">{displayTable}</span>
            </div>
          </div>

          {/* Selector de Moneda */}
          <div className="flex items-center p-0.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-bold">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-2 py-1 rounded-lg text-[11px] font-black ${
                currency === "USD" ? "bg-emerald-500 text-black" : "text-zinc-400"
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency("VES")}
              className={`px-2 py-1 rounded-lg text-[11px] font-black ${
                currency === "VES" ? "bg-amber-500 text-black" : "text-zinc-400"
              }`}
            >
              Bs.
            </button>
          </div>
        </div>
      </header>

      {/* Acciones Rápidas de Mesa: Llamar Mesonero, Pedir Juego, Cuenta */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {/* Botón 1: Llamar Mesonero */}
          <button
            onClick={() => setIsCallWaiterOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all active:scale-95 text-center shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black uppercase text-zinc-200 leading-tight">
              Llamar Mesonero
            </span>
          </button>

          {/* Botón 2: Pedir Juego */}
          <button
            onClick={() => setIsGamePickerOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all active:scale-95 text-center shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-1">
              <Dices className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black uppercase text-zinc-200 leading-tight">
              Pedir Juego
            </span>
          </button>

          {/* Botón 3: Pedir la Cuenta */}
          <button
            onClick={() => setIsBillModalOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all active:scale-95 text-center shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black uppercase text-zinc-200 leading-tight">
              Pedir Cuenta
            </span>
          </button>
        </div>

        {/* Categorías del Menú */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/25"
                    : "bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Lista de Productos para Pedir */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {currentItems.map((item) => {
            const inOrder = orderItems.find((i) => i.item.id === item.id);
            return (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  {item.badge && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="font-black text-sm text-white leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="font-black text-sm text-amber-400 block pt-0.5">
                    {formatPrice(item.priceUSD, currency, bcvRate)}
                  </span>
                </div>

                {/* Controles de Cantidad / Botón Agregar */}
                <div className="shrink-0">
                  {inOrder ? (
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black border border-orange-500/40">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center font-black active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-mono font-black text-xs text-orange-400">
                        {inOrder.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-black flex items-center justify-center font-black active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddItem(item)}
                      className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs flex items-center gap-1 shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Pedir</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BARRA FLOTANTE INFERIOR: VER COMANDA DE LA MESA */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-200">
          <button
            onClick={() => setIsOrderSummaryOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-black flex items-center justify-between shadow-2xl shadow-orange-500/40 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-black text-orange-400 text-xs font-black flex items-center justify-center">
                {totalItemsCount}
              </span>
              <span className="text-xs uppercase tracking-wide">
                Ver Comanda de {displayTable}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm font-black">
              <span>{dualTotal.usd}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* MODAL: RESUMEN DE COMANDA & ENVIAR A BARRA */}
      {isOrderSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-orange-500/40 p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <h3 className="font-black text-sm sm:text-base text-white uppercase">
                  Comanda para {displayTable}
                </h3>
              </div>
              <button
                onClick={() => setIsOrderSummaryOpen(false)}
                className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Ítems */}
            <div className="divide-y divide-white/5 space-y-2">
              {orderItems.map((ci) => (
                <div key={ci.item.id} className="pt-2 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-black text-xs text-white block">
                      {ci.quantity}x {ci.item.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      ${(ci.item.priceUSD * ci.quantity).toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                    <button
                      onClick={() => handleUpdateQuantity(ci.item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center font-mono font-bold text-xs text-orange-400">
                      {ci.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(ci.item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-orange-500 text-black flex items-center justify-center text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Notas */}
            <div className="space-y-1 pt-2">
              <label className="text-[11px] font-bold text-zinc-400 block">
                Instrucciones especiales para la barra / cocina:
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ej. Balde bien frío, salsa tártara aparte..."
                className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Total */}
            <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Total Comanda:</span>
              <div className="text-right">
                <span className="text-base font-black text-white block">{dualTotal.usd}</span>
                <span className="text-[10px] font-mono text-amber-400 block">≈ {dualTotal.ves}</span>
              </div>
            </div>

            {/* Botón de Envío Inmediato a Barra */}
            <button
              onClick={handleSendOrderToBar}
              disabled={orderSent}
              className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all ${
                orderSent
                  ? "bg-emerald-500 text-black"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black shadow-orange-500/25 active:scale-[0.98]"
              }`}
            >
              {orderSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>¡Comanda Enviada a la Barra!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido a la Barra</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: LLAMAR AL MESONERO */}
      {isCallWaiterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-amber-500/40 p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Bell className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base text-white uppercase">Llamar al Mesonero</h3>
              <p className="text-xs text-zinc-400 mt-1">
                ¿Qué necesita {displayTable}?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {[
                "Atención General",
                "Más Hielo / Vasos",
                "Servilletas / Cubiertos",
                "Limpieza de Mesa",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setWaiterReason(reason)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    waiterReason === reason
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-black"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCallWaiterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendWaiterCall}
                disabled={waiterCallSent}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-black uppercase"
              >
                {waiterCallSent ? "¡Llamando...!" : "Enviar Alerta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PEDIR JUEGO DE MESA */}
      {isGamePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-purple-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-sm text-white uppercase">
                  Pedir Juego para {displayTable}
                </h3>
              </div>
              <button
                onClick={() => setIsGamePickerOpen(false)}
                className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Selecciona el juego que deseas y el Game Master te lo llevará a la mesa listo con sus fichas.
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {BOARD_GAMES.map((game) => (
                <div
                  key={game.id}
                  className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 hover:border-purple-500/40 transition-all"
                >
                  <div>
                    <h4 className="font-black text-xs text-white">{game.name}</h4>
                    <span className="text-[10px] text-zinc-400 block">
                      👥 {game.players} · ⏱️ {game.duration}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSendGameRequest(game)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shrink-0 active:scale-95"
                  >
                    Pedir a Mesa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PEDIR LA CUENTA */}
      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-emerald-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm text-white uppercase">
                  Cuenta de {displayTable}
                </h3>
              </div>
              <button
                onClick={() => setIsBillModalOpen(false)}
                className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Datos de Pago Móvil The Corner:
              </span>
              <div className="text-xs space-y-0.5 text-zinc-200">
                <p><strong>Banco:</strong> {PAYMENT_ACCOUNTS.pagoMovil.banco}</p>
                <p><strong>Teléfono:</strong> {PAYMENT_ACCOUNTS.pagoMovil.telefono}</p>
                <p><strong>Cédula / RIF:</strong> {PAYMENT_ACCOUNTS.pagoMovil.ci}</p>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `${PAYMENT_ACCOUNTS.pagoMovil.banco} | ${PAYMENT_ACCOUNTS.pagoMovil.telefono} | ${PAYMENT_ACCOUNTS.pagoMovil.ci}`,
                    "pm"
                  )
                }
                className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-500 text-black font-black text-[11px] inline-flex items-center gap-1.5"
              >
                {copiedField === "pm" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === "pm" ? "¡Copiado!" : "Copiar Datos de Pago"}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 text-center">
              También aceptamos Dólares en Efectivo, Zelle y Binance en la barra.
            </p>

            <button
              onClick={() => setIsBillModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 text-zinc-300 font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
