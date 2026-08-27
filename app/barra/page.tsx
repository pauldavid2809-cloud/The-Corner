"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import {
  Bell,
  CheckCircle2,
  Clock,
  Dices,
  Flame,
  Volume2,
  VolumeX,
  RefreshCw,
  ShoppingBag,
  ArrowLeft,
  Utensils,
  Beer,
  Sparkles,
  Zap,
  Check,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export type LiveKdsOrder = {
  id: string;
  table: string;
  items: {
    name: string;
    quantity: number;
    priceUSD: number;
  }[];
  subtotalUSD: number;
  subtotalVES: number;
  notes?: string;
  status: "pendiente" | "preparando" | "entregado";
  createdAt: string;
};

export type LiveServiceAlert = {
  id: string;
  table: string;
  type: "mesonero" | "juego";
  reason?: string;
  gameName?: string;
  time: string;
};

export default function BarKDSPage() {
  const [orders, setOrders] = useState<LiveKdsOrder[]>([
    {
      id: "ORD-8401",
      table: "Mesa 4",
      items: [
        { name: "Balde Polar Pilsen (10 Cervezas)", quantity: 1, priceUSD: 10 },
        { name: "Tequeños Tradicionales (10 Uds)", quantity: 1, priceUSD: 5 },
      ],
      subtotalUSD: 15,
      subtotalVES: 1152,
      notes: "Balde con bastante hielo, salsa aparte",
      status: "pendiente",
      createdAt: "Hace 2 min",
    },
    {
      id: "ORD-8402",
      table: "Mesa 2",
      items: [
        { name: "Narguile Premium / Sabor Doble Manzana", quantity: 1, priceUSD: 12 },
        { name: "2x Cóctel Corner UV", quantity: 2, priceUSD: 12 },
      ],
      subtotalUSD: 24,
      subtotalVES: 1843.2,
      status: "preparando",
      createdAt: "Hace 6 min",
    },
    {
      id: "ORD-8399",
      table: "Zona VIP",
      items: [
        { name: "Combo 3 Smash Burgers + Papas", quantity: 1, priceUSD: 15 },
        { name: "Ronda Shots Power Rangers (5)", quantity: 1, priceUSD: 8 },
      ],
      subtotalUSD: 23,
      subtotalVES: 1766.4,
      status: "entregado",
      createdAt: "Hace 15 min",
    },
  ]);

  const [alerts, setAlerts] = useState<LiveServiceAlert[]>([
    {
      id: "CALL-1",
      table: "Mesa 5",
      type: "mesonero",
      reason: "Más Hielo / Vasos",
      time: "Hace 1 min",
    },
    {
      id: "GAME-1",
      table: "Mesa 3",
      type: "juego",
      gameName: "Jenga Madera Gigante",
      time: "Hace 4 min",
    },
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"comandas" | "alertas">("comandas");

  // Síntesis de Sonido Campana de Barra (Web Audio API)
  const playServiceChime = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Tono campana doble ding-dong (980Hz -> 1318Hz)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(980, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error(e);
    }
  };

  // Sincronizar comandas de localStorage
  useEffect(() => {
    const syncLocal = () => {
      if (typeof window !== "undefined") {
        try {
          const rawOrders = localStorage.getItem("corner_live_kds_orders");
          if (rawOrders) {
            const parsed = JSON.parse(rawOrders);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setOrders((prev) => {
                // Combinar sin duplicar
                const ids = new Set(parsed.map((p: any) => p.id));
                const filteredPrev = prev.filter((p) => !ids.has(p.id));
                return [...parsed, ...filteredPrev];
              });
            }
          }

          const rawAlerts = localStorage.getItem("corner_live_alerts");
          if (rawAlerts) {
            const parsedAlerts = JSON.parse(rawAlerts);
            if (Array.isArray(parsedAlerts) && parsedAlerts.length > 0) {
              setAlerts(parsedAlerts);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    syncLocal();
    const interval = setInterval(syncLocal, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (orderId: string, nextStatus: LiveKdsOrder["status"]) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
      if (typeof window !== "undefined") {
        localStorage.setItem("corner_live_kds_orders", JSON.stringify(updated));
      }
      return updated;
    });
    playServiceChime();
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => {
      const filtered = prev.filter((a) => a.id !== alertId);
      if (typeof window !== "undefined") {
        localStorage.setItem("corner_live_alerts", JSON.stringify(filtered));
      }
      return filtered;
    });
  };

  const pendingOrders = orders.filter((o) => o.status === "pendiente");
  const preparingOrders = orders.filter((o) => o.status === "preparando");
  const deliveredOrders = orders.filter((o) => o.status === "entregado");

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 p-4 sm:p-6 space-y-6">
      {/* Header del KDS */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Logo size="sm" withText />
          <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black uppercase">
            KDS · Monitor de Barra & Cocina
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Sonido */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              soundEnabled
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? "Alerta Sonora Activa" : "Silenciado"}</span>
          </button>

          {/* Selector de Pestañas */}
          <div className="flex items-center p-1 rounded-xl bg-black border border-zinc-800">
            <button
              onClick={() => setActiveTab("comandas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                activeTab === "comandas"
                  ? "bg-orange-500 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Comandas ({pendingOrders.length + preparingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("alertas")}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                activeTab === "alertas"
                  ? "bg-amber-500 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Llamadas & Juegos
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* PESTAÑA 1: TABLERO KANBAN DE COMANDAS */}
      {activeTab === "comandas" && (
        <div className="grid md:grid-cols-3 gap-5">
          {/* COLUMNA 1: PENDIENTES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <span className="font-black text-xs uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                🟡 Nuevos Pedidos ({pendingOrders.length})
              </span>
            </div>

            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-3xl bg-zinc-900 border-2 border-amber-500/40 space-y-3 shadow-xl animate-in zoom-in-95 duration-200"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-black text-sm text-white px-2.5 py-0.5 rounded-lg bg-orange-500 text-black">
                      {order.table}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">{order.createdAt}</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between font-bold">
                        <span className="text-zinc-200">
                          <strong className="text-orange-400">{i.quantity}x</strong> {i.name}
                        </span>
                        <span className="text-zinc-400">${(i.priceUSD * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-2 rounded-xl bg-black/60 border border-white/5 text-[11px] text-amber-300">
                      <strong>Nota:</strong> {order.notes}
                    </div>
                  )}

                  <button
                    onClick={() => handleUpdateStatus(order.id, "preparando")}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase transition-all"
                  >
                    Empezar a Preparar ➔
                  </button>
                </div>
              ))}
              {pendingOrders.length === 0 && (
                <p className="text-xs text-zinc-500 text-center py-6">
                  No hay pedidos pendientes en cola.
                </p>
              )}
            </div>
          </div>

          {/* COLUMNA 2: EN PREPARACIÓN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <span className="font-black text-xs uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                🔵 En Preparación ({preparingOrders.length})
              </span>
            </div>

            <div className="space-y-3">
              {preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-3xl bg-zinc-900 border border-sky-500/40 space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-black text-sm text-white px-2.5 py-0.5 rounded-lg bg-sky-500 text-black">
                      {order.table}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">{order.createdAt}</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between font-bold">
                        <span className="text-zinc-200">
                          <strong className="text-sky-400">{i.quantity}x</strong> {i.name}
                        </span>
                        <span className="text-zinc-400">${(i.priceUSD * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-2 rounded-xl bg-black/60 border border-white/5 text-[11px] text-zinc-300">
                      <strong>Nota:</strong> {order.notes}
                    </div>
                  )}

                  <button
                    onClick={() => handleUpdateStatus(order.id, "entregado")}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase transition-all"
                  >
                    ✓ Listo para Llevar a Mesa
                  </button>
                </div>
              ))}
              {preparingOrders.length === 0 && (
                <p className="text-xs text-zinc-500 text-center py-6">
                  Barra y cocina al día.
                </p>
              )}
            </div>
          </div>

          {/* COLUMNA 3: ENTREGADOS / COMPLETADOS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="font-black text-xs uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                🟢 Entregados ({deliveredOrders.length})
              </span>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {deliveredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2 opacity-80"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300">{order.table}</span>
                    <span className="font-mono text-[10px] text-zinc-500">{order.createdAt}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 space-y-0.5">
                    {order.items.map((i, idx) => (
                      <p key={idx}>
                        {i.quantity}x {i.name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: ALERTAS DE MESONERO Y PETICIONES DE JUEGOS */}
      {activeTab === "alertas" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-base font-black uppercase text-white">
            Solicitudes de Atención en Mesa
          </h2>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-3xl bg-zinc-900 border border-amber-500/40 flex items-center justify-between gap-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      alert.type === "mesonero"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {alert.type === "mesonero" ? <Bell className="w-5 h-5" /> : <Dices className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white px-2 py-0.5 rounded bg-orange-500 text-black">
                        {alert.table}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{alert.time}</span>
                    </div>
                    <p className="text-xs text-zinc-200 mt-1">
                      {alert.type === "mesonero"
                        ? `Solicitud: ${alert.reason || "Atención en mesa"}`
                        : `Juego pedido: ${alert.gameName}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDismissAlert(alert.id)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-black font-black text-xs transition-all shrink-0"
                >
                  ✓ Atendido
                </button>
              </div>
            ))}

            {alerts.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-10">
                No hay llamadas de mesoneros ni solicitudes de juegos activas.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
