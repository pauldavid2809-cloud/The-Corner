"use client";

import { useState } from "react";
import {
  INITIAL_MANAGER_KPIS,
  INITIAL_LIVE_BOOKINGS,
  LiveBooking,
  BOARD_GAMES,
  MENU_ITEMS,
  BoardGame,
  MenuItem,
  PaymentStatus,
} from "@/data/cornerData";
import { formatPrice, formatDualPrice } from "@/data/currencies";
import { Logo } from "@/components/Logo";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Gamepad2,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Utensils,
  QrCode,
  UserCheck,
  Settings,
  HeartHandshake,
  Check,
  X,
  CreditCard,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Building2,
} from "lucide-react";

type Props = {
  onExitManagerMode: () => void;
  bcvRate: number;
  onUpdateBcvRate: (newRate: number) => void;
};

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "Gerente General" | "Game Master" | "Barra / Mixología" | "Validador Puerta";
  status: "Activo" | "Inactivo";
  lastLogin: string;
};

type ClientRecord = {
  id: string;
  name: string;
  phone: string;
  visits: number;
  totalSpentUSD: number;
  favoriteGame: string;
  lastVisit: string;
};

export function ManagerDashboard({
  onExitManagerMode,
  bcvRate,
  onUpdateBcvRate,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "payments" | "menu" | "ludoteca" | "users" | "crm" | "settings"
  >("payments");

  const [kpis, setKpis] = useState(INITIAL_MANAGER_KPIS);
  const [bookings, setBookings] = useState<LiveBooking[]>(INITIAL_LIVE_BOOKINGS);
  const [tempRate, setTempRate] = useState<string>(bcvRate.toString());
  const [rateSuccess, setRateSuccess] = useState<boolean>(false);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("todos");
  const [paymentSearch, setPaymentSearch] = useState<string>("");

  // State: Menú (CRUD)
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(MENU_ITEMS);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuCategory, setNewMenuCategory] = useState<MenuItem["category"]>("combos-promos");
  const [newMenuDesc, setNewMenuDesc] = useState("");

  // State: Ludoteca (CRUD)
  const [gamesList, setGamesList] = useState<BoardGame[]>(BOARD_GAMES);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [newGamePlayers, setNewGamePlayers] = useState("3-4 jugadores");
  const [newGameDuration, setNewGameDuration] = useState("30-45 min");
  const [newGameDifficulty, setNewGameDifficulty] = useState<BoardGame["difficulty"]>("Fácil & Rápido");
  const [newGameCategory, setNewGameCategory] = useState<BoardGame["category"]>("party");
  const [newGameDesc, setNewGameDesc] = useState("");

  // State: Staff
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    {
      id: "USR-01",
      name: "Paul David (Gerente)",
      email: "gerencia@thecornermcbo.com",
      role: "Gerente General",
      status: "Activo",
      lastLogin: "Hace 5 min",
    },
    {
      id: "USR-02",
      name: "Andrea Colina",
      email: "andrea.gm@thecornermcbo.com",
      role: "Game Master",
      status: "Activo",
      lastLogin: "Hoy 17:45",
    },
    {
      id: "USR-03",
      name: "Carlos Villalobos",
      email: "mixologia@thecornermcbo.com",
      role: "Barra / Mixología",
      status: "Activo",
      lastLogin: "Ayer",
    },
  ]);

  // Contadores
  const pendingPaymentsCount = bookings.filter((b) => b.paymentStatus === "pendiente").length;

  // Acciones de Pagos
  const handleApprovePayment = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              paymentStatus: "aprobado",
              status: "confirmada",
              approvedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              approvedBy: "Gerente General",
            }
          : b
      )
    );
  };

  const handleRejectPayment = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus: "rechazado" } : b))
    );
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempRate);
    if (!isNaN(val) && val > 0) {
      onUpdateBcvRate(val);
      setRateSuccess(true);
      setTimeout(() => setRateSuccess(false), 3000);
    }
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName || !newMenuPrice) return;
    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: newMenuName,
      priceUSD: parseFloat(newMenuPrice),
      category: newMenuCategory,
      description: newMenuDesc,
      popular: false,
    };
    setMenuItemsList((prev) => [newItem, ...prev]);
    setNewMenuName("");
    setNewMenuPrice("");
    setNewMenuDesc("");
    setShowAddMenuModal(false);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItemsList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName) return;
    const newG: BoardGame = {
      id: `game-${Date.now()}`,
      name: newGameName,
      category: newGameCategory,
      players: newGamePlayers,
      duration: newGameDuration,
      difficulty: newGameDifficulty,
      description: newGameDesc,
      rulesSummary: "Reglas disponibles en The Corner Costa Verde.",
      tags: ["Nuevo", "Costa Verde"],
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      minPlayers: 2,
      maxPlayers: 8,
      minMinutes: 30,
    };
    setGamesList((prev) => [newG, ...prev]);
    setNewGameName("");
    setNewGameDesc("");
    setShowAddGameModal(false);
  };

  const handleDeleteGame = (id: string) => {
    setGamesList((prev) => prev.filter((g) => g.id !== id));
  };

  // Filtrado de Pagos
  const filteredBookings = bookings.filter((b) => {
    if (filterPaymentStatus !== "todos" && b.paymentStatus !== filterPaymentStatus) {
      return false;
    }
    if (paymentSearch.trim()) {
      const q = paymentSearch.toLowerCase();
      return (
        b.clientName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.paymentReference && b.paymentReference.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onExitManagerMode}
              className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la WebApp</span>
            </button>
            <Logo size="sm" withText />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase">
              Admin & Conciliación
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs">
              <span className="text-zinc-500 text-[10px] block font-bold">Tasa BCV:</span>
              <span className="font-mono font-bold text-amber-400">{bcvRate.toFixed(2)} Bs./$</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { id: "payments", label: "💰 Gestión de Pagos", badge: pendingPaymentsCount },
            { id: "overview", label: "🎟️ Mesas & Reservas" },
            { id: "menu", label: "🍔 Menú & Promos" },
            { id: "ludoteca", label: "🎲 Ludoteca & Juegos" },
            { id: "users", label: "👥 Usuarios & Staff" },
            { id: "settings", label: "⚙️ Tasa BCV & Ajustes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shrink-0 transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: GESTIÓN DE PAGOS Y CONCILIACIÓN (SIMILAR A PARRANDÓN) */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Conciliación & Aprobación de Pagos
                </h2>
                <p className="text-xs text-zinc-400">
                  Verifica las transferencias de Pago Móvil, Zelle o Binance y aprueba la emisión del QR oficial.
                </p>
              </div>

              {/* Filtros */}
              <div className="flex items-center gap-2">
                {["todos", "pendiente", "aprobado", "rechazado"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterPaymentStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                      filterPaymentStatus === st
                        ? "bg-orange-500 text-black font-black"
                        : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Búsqueda */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                placeholder="Buscar por cliente, #ticket o número de referencia..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Tabla de Pagos */}
            <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-[10px] uppercase font-black tracking-wider text-zinc-400 border-b border-white/5">
                  <tr>
                    <th className="p-4">Ticket / Cliente</th>
                    <th className="p-4">Paquete</th>
                    <th className="p-4">Método & Referencia</th>
                    <th className="p-4">Monto (USD / Bs)</th>
                    <th className="p-4">Estado del Pago</th>
                    <th className="p-4 text-right">Acciones de Aprobación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((b) => {
                    const dual = formatDualPrice(b.totalUSD, bcvRate);
                    return (
                      <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-black text-orange-400 block">
                            #{b.id}
                          </span>
                          <span className="font-bold text-white block mt-0.5">
                            {b.clientName}
                          </span>
                          <span className="text-[10px] text-zinc-400 block">
                            {b.phone}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-zinc-200 block">
                            {b.planName}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {b.date} · {b.time} ({b.pax} pax)
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 font-bold text-white uppercase text-[11px]">
                            {b.paymentMethod === "pago_movil" && <Smartphone className="w-3.5 h-3.5 text-emerald-400" />}
                            {b.paymentMethod === "zelle" && <DollarSign className="w-3.5 h-3.5 text-sky-400" />}
                            {b.paymentMethod === "binance" && <Building2 className="w-3.5 h-3.5 text-amber-400" />}
                            {b.paymentMethod.replace("_", " ")}
                          </span>
                          {b.paymentReference ? (
                            <span className="font-mono font-bold text-emerald-400 block text-[11px] mt-0.5">
                              Ref: #{b.paymentReference}
                              {b.paymentBank ? ` (${b.paymentBank})` : ""}
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-500 block">
                              En Puerta
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className="font-black text-white block text-sm">
                            {dual.usd}
                          </span>
                          <span className="font-mono text-[10px] text-amber-400 block">
                            ≈ {dual.ves}
                          </span>
                        </td>

                        <td className="p-4">
                          {b.paymentStatus === "pendiente" && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase inline-flex items-center gap-1">
                              🟡 Pendiente
                            </span>
                          )}
                          {b.paymentStatus === "aprobado" && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase inline-flex items-center gap-1">
                              🟢 Aprobado & QR Activo
                            </span>
                          )}
                          {b.paymentStatus === "rechazado" && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase inline-flex items-center gap-1">
                              🔴 Rechazado
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.paymentStatus === "pendiente" && (
                              <>
                                <button
                                  onClick={() => handleApprovePayment(b.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aprobar & Activar QR</span>
                                </button>

                                <button
                                  onClick={() => handleRejectPayment(b.id)}
                                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            {/* Botón WhatsApp */}
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `¡Hola ${b.clientName}! Te escribimos de The Corner Costa Verde. Tu reserva #${b.id} para el ${b.planName} tiene estado: *${b.paymentStatus.toUpperCase()}*. ¡Te esperamos!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400"
                              title="Abrir WhatsApp con el cliente"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MENÚ & PROMOS */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  Gestión de Menú, Narguiles & Promos
                </h2>
                <p className="text-xs text-zinc-400">
                  Agrega, edita precios o retira platos, baldes de cerveza o cócteles.
                </p>
              </div>

              <button
                onClick={() => setShowAddMenuModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItemsList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-orange-400">
                        {item.category}
                      </span>
                      <span className="font-black text-white">
                        ${item.priceUSD.toFixed(2)}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">{item.name}</h3>
                    <p className="text-xs text-zinc-400">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AJUSTES & TASA BCV */}
        {activeTab === "settings" && (
          <div className="max-w-xl p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
            <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-400" />
              Configuración de Tasa BCV Oficial
            </h2>
            <p className="text-xs text-zinc-400">
              Modifica la tasa del Banco Central de Venezuela utilizada para calcular los montos en Bolívares de los paquetes y de la carta.
            </p>

            <form onSubmit={handleSaveRate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Tasa Dólar BCV (Bs. / USD):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tempRate}
                  onChange={(e) => setTempRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm font-mono text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {rateSuccess && (
                <p className="text-xs text-emerald-400 font-bold">
                  ✓ Tasa actualizada exitosamente en toda la plataforma.
                </p>
              )}

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-orange-500 text-black font-black text-xs hover:bg-orange-600 shadow-md transition-all"
              >
                Guardar Nueva Tasa
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
