"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { MenuItem, MENU_ITEMS, BoardGame, BOARD_GAMES, PAYMENT_ACCOUNTS } from "@/data/cornerData";
import { CurrencyMode, DEFAULT_BCV_RATE, formatPrice, formatDualPrice } from "@/data/currencies";
import { fetchLiveExchangeRates } from "@/lib/services";
import { Logo } from "@/components/Logo";
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
  Search,
  Wifi,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

type TableOrderItem = {
  item: MenuItem;
  quantity: number;
};

type PlacedOrder = {
  id: string;
  items: { name: string; quantity: number; priceUSD: number }[];
  subtotalUSD: number;
  status: "pendiente" | "preparando" | "entregado";
  time: string;
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
  const [searchQuery, setSearchQuery] = useState("");

  // Comanda actual
  const [orderItems, setOrderItems] = useState<TableOrderItem[]>([]);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Historial de pedidos activos de la mesa
  const [activeOrders, setActiveOrders] = useState<PlacedOrder[]>([]);

  // Modales interactivos
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [waiterCallSent, setWaiterCallSent] = useState(false);
  const [waiterReason, setWaiterReason] = useState("Atención general en mesa");
  const [customWaiterNote, setCustomWaiterNote] = useState("");

  const [isGamePickerOpen, setIsGamePickerOpen] = useState(false);
  const [gameSearchQuery, setGameSearchQuery] = useState("");
  const [selectedGameRequest, setSelectedGameRequest] = useState<BoardGame | null>(null);
  const [gameRequestSent, setGameRequestSent] = useState(false);

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Audio feedback (Web Audio API)
  const playTactileBeep = (freq: number = 900, duration: number = 0.08) => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silencioso
    }
  };

  useEffect(() => {
    fetchLiveExchangeRates().then((rate) => {
      if (rate) setBcvRate(rate);
    });

    // Cargar órdenes previas de la mesa desde localStorage
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`corner_orders_${displayTable}`);
        if (saved) {
          setActiveOrders(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [displayTable]);

  const categories = [
    { id: "combos-promos", label: "🔥 Promos $10 & Baldes", icon: Zap },
    { id: "baldes-cervezas", label: "🍺 Baldes de Cerveza", icon: Beer },
    { id: "narguiles-shots", label: "💨 Narguiles & Shots", icon: Sparkles },
    { id: "comida-munchies", label: "🍔 Burgers & Perros", icon: Utensils },
    { id: "cocteles-botellas", label: "🍸 Cócteles & Botellas", icon: Flame },
  ];

  // Filtrado de ítems por categoría y búsqueda
  const currentItems = useMemo(() => {
    let list = MENU_ITEMS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.filter((i) => i.category === activeCategory);
  }, [activeCategory, searchQuery]);

  // Filtrado de juegos
  const filteredGames = useMemo(() => {
    if (!gameSearchQuery.trim()) return BOARD_GAMES;
    const q = gameSearchQuery.toLowerCase();
    return BOARD_GAMES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
  }, [gameSearchQuery]);

  // Totales
  const totalItemsCount = orderItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalUSD = orderItems.reduce((acc, i) => acc + i.item.priceUSD * i.quantity, 0);
  const dualTotal = formatDualPrice(subtotalUSD, bcvRate);

  // Total acumulado de pedidos de la mesa para la cuenta
  const totalBillUSD = activeOrders.reduce((acc, o) => acc + o.subtotalUSD, 0) + subtotalUSD;
  const tipAmountUSD = (totalBillUSD * tipPercentage) / 100;
  const finalBillUSD = totalBillUSD + tipAmountUSD;
  const dualBill = formatDualPrice(finalBillUSD, bcvRate);

  const handleAddItem = (item: MenuItem) => {
    playTactileBeep(1000, 0.06);
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
    playTactileBeep(delta > 0 ? 1100 : 750, 0.05);
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
    if (orderItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    const newOrder: PlacedOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: orderItems.map((i) => ({
        name: i.item.name,
        quantity: i.quantity,
        priceUSD: i.item.priceUSD,
      })),
      subtotalUSD,
      status: "pendiente",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const kdsPayload = {
      id: newOrder.id,
      table: displayTable,
      items: newOrder.items,
      subtotalUSD,
      subtotalVES: subtotalUSD * bcvRate,
      notes: orderNotes.trim() || undefined,
      status: "pendiente",
      createdAt: newOrder.time,
    };

    // Guardar para monitor KDS en vivo (/barra)
    if (typeof window !== "undefined") {
      try {
        const currentKds = JSON.parse(localStorage.getItem("corner_live_kds_orders") || "[]");
        localStorage.setItem(
          "corner_live_kds_orders",
          JSON.stringify([kdsPayload, ...currentKds])
        );

        const updatedTableOrders = [newOrder, ...activeOrders];
        setActiveOrders(updatedTableOrders);
        localStorage.setItem(
          `corner_orders_${displayTable}`,
          JSON.stringify(updatedTableOrders)
        );
      } catch (e) {
        console.error(e);
      }
    }

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#ff5500", "#f59e0b", "#10b981"],
    });

    playTactileBeep(1200, 0.15);

    setTimeout(() => {
      setOrderItems([]);
      setOrderNotes("");
      setIsOrderSummaryOpen(false);
      setIsSubmitting(false);
    }, 1200);
  };

  // Llamar al mesonero
  const handleSendWaiterCall = () => {
    const finalReason = customWaiterNote.trim()
      ? `${waiterReason} (${customWaiterNote.trim()})`
      : waiterReason;

    const newAlert = {
      id: `CALL-${Date.now()}`,
      table: displayTable,
      type: "mesonero",
      reason: finalReason,
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

    playTactileBeep(1100, 0.12);
    setWaiterCallSent(true);
    setTimeout(() => {
      setIsCallWaiterOpen(false);
      setWaiterCallSent(false);
      setCustomWaiterNote("");
    }, 1800);
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

    playTactileBeep(1300, 0.12);
    setSelectedGameRequest(game);
    setGameRequestSent(true);
    setTimeout(() => {
      setIsGamePickerOpen(false);
      setGameRequestSent(false);
      setSelectedGameRequest(null);
    }, 1800);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    playTactileBeep(1200, 0.08);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 pb-32 selection:bg-orange-500 selection:text-black">
      {/* 1. HEADER CONTEXTUAL CON IDENTIDAD DE MESA */}
      <header className="sticky top-0 z-30 bg-[#07070B]/90 backdrop-blur-2xl border-b border-orange-500/25 px-4 py-3 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="active:scale-95 transition-transform">
              <Logo size="sm" withText />
            </Link>
            <span className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-orange-500/15 border border-orange-500/40 text-orange-400 shadow-sm shadow-orange-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="font-black text-xs uppercase tracking-wider">{displayTable}</span>
            </div>
          </div>

          {/* Selector de Moneda y Ticker */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-xs font-bold shadow-inner">
              <button
                onClick={() => {
                  setCurrency("USD");
                  playTactileBeep(900, 0.04);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all active:scale-95 ${
                  currency === "USD" ? "bg-emerald-500 text-black shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => {
                  setCurrency("VES");
                  playTactileBeep(900, 0.04);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all active:scale-95 ${
                  currency === "VES" ? "bg-amber-500 text-black shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                Bs.
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-5">
        {/* BANNER DE BIENVENIDA A LA MESA */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-zinc-950 to-purple-950/30 p-4 sm:p-5 shadow-2xl">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-orange-500 text-black text-[10px] font-black uppercase">
                  Mesa Conectada
                </span>
                <span className="text-[11px] font-bold text-zinc-400">
                  💵 1$ = <strong className="text-emerald-400">{bcvRate.toFixed(2)}</strong> Bs. (BCV Euro)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Pide a la Barra desde tu mesa
              </h1>
              <p className="text-xs text-zinc-300 max-w-lg mt-0.5">
                Baldes a $10, narguiles con carbón de coco, shots, burgers y juegos de mesa servidos directamente a tu lugar.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-2xl bg-black/60 border border-white/10 text-center">
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Wi-Fi Clientes</span>
                <span className="text-xs font-mono font-black text-amber-400">TheCorner_VIP</span>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 2. LAS 3 ACCIONES HERO DE MESA (Llamar, Juego, Cuenta) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Botón 1: Llamar Mesonero */}
          <button
            onClick={() => {
              setIsCallWaiterOpen(true);
              playTactileBeep(950, 0.05);
            }}
            className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-amber-500/10 to-zinc-950 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-200 active:scale-[0.96] shadow-lg shadow-amber-500/5 text-center"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-1.5 group-hover:scale-110 transition-transform duration-200">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase text-zinc-100 leading-tight">
              Llamar
            </span>
            <span className="text-[10px] font-bold text-amber-400/90">Mesonero</span>
          </button>

          {/* Botón 2: Pedir Juego de Mesa */}
          <button
            onClick={() => {
              setIsGamePickerOpen(true);
              playTactileBeep(950, 0.05);
            }}
            className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-purple-500/10 to-zinc-950 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-200 active:scale-[0.96] shadow-lg shadow-purple-500/5 text-center"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-1.5 group-hover:scale-110 transition-transform duration-200">
              <Dices className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase text-zinc-100 leading-tight">
              Pedir Juego
            </span>
            <span className="text-[10px] font-bold text-purple-400/90">50+ Juegos</span>
          </button>

          {/* Botón 3: Pedir la Cuenta */}
          <button
            onClick={() => {
              setIsBillModalOpen(true);
              playTactileBeep(950, 0.05);
            }}
            className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-zinc-950 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-200 active:scale-[0.96] shadow-lg shadow-emerald-500/5 text-center"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform duration-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase text-zinc-100 leading-tight">
              Pedir Cuenta
            </span>
            <span className="text-[10px] font-bold text-emerald-400/90">Ver Total</span>
          </button>
        </div>

        {/* TRACKER DE PEDIDOS EN CURSO DE LA MESA */}
        {activeOrders.length > 0 && (
          <div className="p-4 rounded-3xl bg-zinc-900/90 border border-orange-500/30 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="font-black text-xs uppercase text-white">
                  Tus Pedidos en {displayTable} ({activeOrders.length})
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">En tiempo real</span>
            </div>

            <div className="space-y-2">
              {activeOrders.slice(0, 2).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-black/60 border border-white/5 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-400">{order.id}</span>
                      <span className="text-zinc-300 font-bold">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{order.time}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase shrink-0">
                    En Barra / Cocina
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. BUSCADOR RÁPIDO & PESTAÑAS DE CATEGORÍAS */}
        <div className="space-y-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar baldes, narguiles, tequeños, cócteles..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-bold text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Carrusel de Categorías con scroll suave de borde a borde */}
          {!searchQuery && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      playTactileBeep(900, 0.04);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 duration-150 ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/25"
                        : "bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. LISTA DE PRODUCTOS TÁCTILES */}
        <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
          {currentItems.map((item) => {
            const inOrder = orderItems.find((i) => i.item.id === item.id);
            const dual = formatDualPrice(item.priceUSD, bcvRate);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl bg-zinc-900/85 border transition-all duration-200 flex flex-col justify-between shadow-xl ${
                  inOrder
                    ? "border-orange-500 bg-zinc-900 shadow-orange-500/10"
                    : "border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      {item.badge && (
                        <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          {item.badge}
                        </span>
                      )}
                      <h3 className="font-black text-sm text-white leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-base text-white block">
                        {formatPrice(item.priceUSD, currency, bcvRate)}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        {currency === "USD" ? `≈ ${dual.ves}` : `≈ ${dual.usd}`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Controles de Cantidad / Botón Pedir */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    {inOrder ? `${inOrder.quantity} en comanda` : "Disponible en barra"}
                  </span>

                  {inOrder ? (
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black border border-orange-500/50 shadow-md animate-in zoom-in-95 duration-150">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center font-black active:scale-90 transition-transform"
                        aria-label="Restar uno"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono font-black text-sm text-orange-400">
                        {inOrder.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-black flex items-center justify-center font-black active:scale-90 transition-transform"
                        aria-label="Sumar uno"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddItem(item)}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
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

      {/* 5. BARRA FLOTANTE INFERIOR: VER COMANDA DE LA MESA */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-200">
          <button
            onClick={() => {
              setIsOrderSummaryOpen(true);
              playTactileBeep(1000, 0.08);
            }}
            className="w-full p-4 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-black flex items-center justify-between shadow-2xl shadow-orange-500/50 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-black text-orange-400 text-xs font-black flex items-center justify-center">
                {totalItemsCount}
              </span>
              <span className="text-xs uppercase tracking-wide">
                Ver Comanda ({displayTable})
              </span>
            </div>

            <div className="flex items-center gap-1 text-base font-black">
              <span>{dualTotal.usd}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* MODAL 1: RESUMEN DE COMANDA & CONFIRMAR ENVÍO A BARRA */}
      {isOrderSummaryOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-orange-500/40 p-5 sm:p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <h3 className="font-black text-base text-white uppercase">
                  Comanda para {displayTable}
                </h3>
              </div>
              <button
                onClick={() => setIsOrderSummaryOpen(false)}
                className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white active:scale-90 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Ítems */}
            <div className="divide-y divide-white/5 space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {orderItems.map((ci) => (
                <div key={ci.item.id} className="pt-2.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-black text-sm text-white block">
                      {ci.quantity}x {ci.item.name}
                    </span>
                    <span className="text-xs text-zinc-400">
                      ${(ci.item.priceUSD * ci.quantity).toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <button
                      onClick={() => handleUpdateQuantity(ci.item.id, -1)}
                      className="w-7 h-7 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-xs active:scale-90"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-mono font-bold text-xs text-orange-400">
                      {ci.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(ci.item.id, 1)}
                      className="w-7 h-7 rounded-xl bg-orange-500 text-black flex items-center justify-center text-xs font-bold active:scale-90"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Instrucciones Especiales */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-zinc-400 block">
                Instrucciones especiales para el bartender / cocina:
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ej. Balde bien frío, salsa tártara aparte, vaso sin hielo..."
                className="w-full px-4 py-2.5 rounded-2xl bg-black border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Total */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Total de la ronda:</span>
              <div className="text-right">
                <span className="text-lg font-black text-white block">{dualTotal.usd}</span>
                <span className="text-xs font-mono text-amber-400 block">≈ {dualTotal.ves}</span>
              </div>
            </div>

            {/* Botón Enviar */}
            <button
              onClick={handleSendOrderToBar}
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-black font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>¡Enviando Comanda a la Barra...!</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar Pedido a la Barra</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: LLAMAR AL MESONERO */}
      {isCallWaiterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-amber-500/40 p-5 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Bell className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-lg text-white uppercase">Llamar al Mesonero</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                ¿Qué necesita {displayTable}?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {[
                "Atención General",
                "Hielo / Vasos",
                "Servilletas",
                "Limpieza de Mesa",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setWaiterReason(reason);
                    playTactileBeep(900, 0.04);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${
                    waiterReason === reason
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-black shadow-md shadow-amber-500/10"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customWaiterNote}
              onChange={(e) => setCustomWaiterNote(e.target.value)}
              placeholder="Detalle extra (opcional)..."
              className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsCallWaiterOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendWaiterCall}
                disabled={waiterCallSent}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-black uppercase active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
              >
                {waiterCallSent ? "¡Avisando...!" : "Enviar Alerta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PEDIR JUEGO DE MESA */}
      {isGamePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-purple-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-purple-400" />
                <h3 className="font-black text-base text-white uppercase">
                  Ludoteca para {displayTable}
                </h3>
              </div>
              <button
                onClick={() => setIsGamePickerOpen(false)}
                className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={gameSearchQuery}
                onChange={(e) => setGameSearchQuery(e.target.value)}
                placeholder="Buscar Jenga, Mario Kart, Uno, Catan..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 hover:border-purple-500/40 transition-all"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-black text-sm text-white">{game.name}</h4>
                    <span className="text-[11px] text-zinc-400 block">
                      👥 {game.players} · ⏱️ {game.duration} · {game.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSendGameRequest(game)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shrink-0 active:scale-95 transition-transform"
                  >
                    Pedir a Mesa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PEDIR LA CUENTA CON CÁLCULO DUAL Y PAGO MÓVIL */}
      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-emerald-500/40 p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base text-white uppercase">
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

            {/* Propina Sugerida */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 block">
                Propina sugerida al staff:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 10, 15, 20].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTipPercentage(t);
                      playTactileBeep(950, 0.04);
                    }}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      tipPercentage === t
                        ? "bg-emerald-500 text-black font-black"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    {t === 0 ? "Sin Propina" : `${t}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Desglose de Cuenta */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Consumo Total:</span>
                <span className="font-mono text-white">${totalBillUSD.toFixed(2)} USD</span>
              </div>
              {tipPercentage > 0 && (
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Propina ({tipPercentage}%):</span>
                  <span className="font-mono text-emerald-400">+${tipAmountUSD.toFixed(2)} USD</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex justify-between items-end">
                <span className="text-xs font-black uppercase text-white">Total a Pagar:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400 block leading-none">
                    {dualBill.usd}
                  </span>
                  <span className="text-xs font-mono text-amber-400 block mt-0.5">
                    ≈ {dualBill.ves}
                  </span>
                </div>
              </div>
            </div>

            {/* Datos de Pago Móvil con botón 1-tap copy */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Datos de Pago Móvil The Corner:
              </span>
              <div className="text-xs space-y-0.5 text-zinc-200 font-medium">
                <p><strong>Banco:</strong> {PAYMENT_ACCOUNTS.pagoMovil.banco}</p>
                <p><strong>Teléfono:</strong> {PAYMENT_ACCOUNTS.pagoMovil.telefono}</p>
                <p><strong>Cédula:</strong> {PAYMENT_ACCOUNTS.pagoMovil.ci}</p>
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    `${PAYMENT_ACCOUNTS.pagoMovil.banco} | ${PAYMENT_ACCOUNTS.pagoMovil.telefono} | ${PAYMENT_ACCOUNTS.pagoMovil.ci}`,
                    "pm"
                  )
                }
                className="mt-1.5 w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                {copiedField === "pm" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === "pm" ? "¡Datos Copiados!" : "Copiar Datos de Pago Móvil"}</span>
              </button>
            </div>

            <button
              onClick={() => setIsBillModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
