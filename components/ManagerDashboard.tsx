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
} from "@/data/cornerData";
import { formatPrice, formatDualPrice } from "@/data/currencies";
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
  Edit,
  Utensils,
  QrCode,
  UserCheck,
  Settings,
  HeartHandshake,
  Check,
  X,
  Flame,
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
    "overview" | "menu" | "ludoteca" | "users" | "crm" | "settings"
  >("overview");

  const [kpis, setKpis] = useState(INITIAL_MANAGER_KPIS);
  const [bookings, setBookings] = useState<LiveBooking[]>(INITIAL_LIVE_BOOKINGS);
  const [tempRate, setTempRate] = useState<string>(bcvRate.toString());
  const [rateSuccess, setRateSuccess] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("todas");

  // State: Menú (CRUD)
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(MENU_ITEMS);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuCategory, setNewMenuCategory] = useState<MenuItem["category"]>("pociones");
  const [newMenuDesc, setNewMenuDesc] = useState("");

  // State: Ludoteca (CRUD)
  const [gamesList, setGamesList] = useState<BoardGame[]>(BOARD_GAMES);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [newGamePlayers, setNewGamePlayers] = useState("3-4 jugadores");
  const [newGameDuration, setNewGameDuration] = useState("30-45 min");
  const [newGameDifficulty, setNewGameDifficulty] = useState<"Principiante" | "Intermedio" | "Experto">("Principiante");
  const [newGameCategory, setNewGameCategory] = useState<BoardGame["category"]>("party");
  const [newGameDesc, setNewGameDesc] = useState("");

  // State: Staff / Usuarios
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    {
      id: "USR-01",
      name: "Paul David",
      email: "gerencia@thecornermcbo.com",
      role: "Gerente General",
      status: "Activo",
      lastLogin: "Hace 2 min",
    },
    {
      id: "USR-02",
      name: "Andrea Colina",
      email: "andrea.gm@thecornermcbo.com",
      role: "Game Master",
      status: "Activo",
      lastLogin: "Hoy 05:10 PM",
    },
    {
      id: "USR-03",
      name: "Carlos Villalobos",
      email: "mixologia@thecornermcbo.com",
      role: "Barra / Mixología",
      status: "Activo",
      lastLogin: "Hoy 04:45 PM",
    },
    {
      id: "USR-04",
      name: "Validador Puerta (Turno Noche)",
      email: "seguridad@thecornermcbo.com",
      role: "Validador Puerta",
      status: "Activo",
      lastLogin: "Ayer 11:30 PM",
    },
  ]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<StaffUser["role"]>("Game Master");

  // State: CRM Clientes
  const [clients] = useState<ClientRecord[]>([
    {
      id: "CLI-101",
      name: "Luis Ignacio Torres",
      phone: "+58 414 6321980",
      visits: 8,
      totalSpentUSD: 310,
      favoriteGame: "Los Colonos de Catan",
      lastVisit: "Hoy (En Mesa 4)",
    },
    {
      id: "CLI-102",
      name: "Mariana Albornoz",
      phone: "+58 424 6104432",
      visits: 4,
      totalSpentUSD: 240,
      favoriteGame: "Secret Hitler",
      lastVisit: "Hoy (Salón VIP)",
    },
    {
      id: "CLI-103",
      name: "Gustavo Guanipa",
      phone: "+58 412 9081122",
      visits: 12,
      totalSpentUSD: 520,
      favoriteGame: "Dungeons & Dragons 5e",
      lastVisit: "Hace 3 días",
    },
  ]);

  // Préstamos de Ludoteca en vivo
  const [loanedGames, setLoanedGames] = useState<
    { gameId: string; gameName: string; table: string; time: string }[]
  >([
    {
      gameId: "catan",
      gameName: "Los Colonos de Catan",
      table: "Mesa 4",
      time: "06:30 PM",
    },
    {
      gameId: "secret-hitler",
      gameName: "Secret Hitler",
      table: "Salón VIP Mazmorra",
      time: "08:00 PM",
    },
    {
      gameId: "radlands",
      gameName: "Radlands: Duelo Cyberpunk",
      table: "Mesa 2 (Barra)",
      time: "07:15 PM",
    },
  ]);

  const [newLoanGame, setNewLoanGame] = useState<string>(BOARD_GAMES[0].name);
  const [newLoanTable, setNewLoanTable] = useState<string>("Mesa 1");

  // Handlers
  const handleStatusChange = (
    id: string,
    newStatus: "confirmada" | "en_mesa" | "pendiente" | "finalizada"
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempRate);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateBcvRate(parsed);
      setRateSuccess(true);
      setTimeout(() => setRateSuccess(false), 2000);
    }
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    setLoanedGames((prev) => [
      ...prev,
      {
        gameId: Math.random().toString(),
        gameName: newLoanGame,
        table: newLoanTable,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleReturnLoan = (index: number) => {
    setLoanedGames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName.trim() || !newMenuPrice) return;
    const item: MenuItem = {
      id: `menu-custom-${Date.now()}`,
      name: newMenuName.trim(),
      priceUSD: parseFloat(newMenuPrice),
      category: newMenuCategory,
      description: newMenuDesc.trim() || "Preparado al momento en The Corner.",
      badge: "Nuevo",
    };
    setMenuItemsList((prev) => [item, ...prev]);
    setNewMenuName("");
    setNewMenuPrice("");
    setNewMenuDesc("");
    setShowAddMenuModal(false);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItemsList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) return;
    const newG: BoardGame = {
      id: `game-custom-${Date.now()}`,
      name: newGameName.trim(),
      players: newGamePlayers,
      duration: newGameDuration,
      difficulty: newGameDifficulty,
      category: newGameCategory,
      description: newGameDesc.trim() || "Nuevo juego añadido al catálogo.",
      rulesSummary: "Reglas explicadas en sala por nuestros Game Masters.",
      tags: ["Nuevo", "Ludoteca"],
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      badge: "Nuevo en Ludoteca",
      minPlayers: 2,
      maxPlayers: 6,
      minMinutes: 30,
    };
    setGamesList((prev) => [newG, ...prev]);
    setNewGameName("");
    setNewGameDesc("");
    setShowAddGameModal(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const u: StaffUser = {
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: "Activo",
      lastLogin: "Recién creado",
    };
    setStaffUsers((prev) => [...prev, u]);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUserModal(false);
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "todas") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#07070a] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera del Panel Administrativo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white uppercase tracking-tight">
                  Panel de Administración & Gerencia
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SISTEMA EN VIVO
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                The Corner Maracaibo · Calle 72 con Av. 10
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitManagerMode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs transition-all border border-zinc-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver WebApp como Cliente</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { id: "overview", label: "Mesas & Reservas", icon: QrCode },
            { id: "menu", label: "Gestión de Menú (Precios)", icon: Utensils },
            { id: "ludoteca", label: "Catálogo de Juegos (50+)", icon: Gamepad2 },
            { id: "users", label: "Usuarios & Staff", icon: Users },
            { id: "crm", label: "Historial de Clientes", icon: HeartHandshake },
            { id: "settings", label: "Tasa BCV & Ajustes", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20 scale-105"
                    : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* PESTAÑA 1: OVERVIEW & MESAS */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold uppercase">Mesas Ocupadas</span>
                  <Users className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {kpis.activeTables}
                  </span>
                  <span className="text-xs text-zinc-500">/ {kpis.totalTables} mesas</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold uppercase">Juegos en Sala</span>
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {loanedGames.length}
                  </span>
                  <span className="text-xs text-zinc-500">en uso activo</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold uppercase">Ventas Estimadas Hoy</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    ${kpis.todaySalesUSD}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">USD</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold uppercase">Tasa BCV en Sistema</span>
                  <Settings className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {bcvRate}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">Bs / USD</span>
                </div>
              </div>
            </div>

            {/* Monitor de Préstamos Rápidos */}
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase text-orange-400 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    Monitor de Juegos Prestados a Mesas
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Registra en 1 clic qué juego fue entregado a qué mesa.
                  </p>
                </div>

                <form onSubmit={handleAddLoan} className="flex items-center gap-2">
                  <select
                    value={newLoanGame}
                    onChange={(e) => setNewLoanGame(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-black border border-zinc-700 text-xs text-white"
                  >
                    {gamesList.slice(0, 20).map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newLoanTable}
                    onChange={(e) => setNewLoanTable(e.target.value)}
                    placeholder="Mesa #"
                    className="w-24 px-3 py-1.5 rounded-xl bg-black border border-zinc-700 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-black font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Prestar
                  </button>
                </form>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {loanedGames.map((loan, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block truncate">
                        {loan.gameName}
                      </span>
                      <span className="text-[10px] text-orange-400 font-semibold">
                        📍 {loan.table} · ⏱️ {loan.time}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReturnLoan(idx)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 text-[10px] font-bold text-zinc-300 hover:text-emerald-400 border border-zinc-700"
                    >
                      Devolver
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabla de Reservas */}
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight">
                    Reservas y Comensales del Día
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Cambio de estado en tiempo real para recepción y barra.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {["todas", "confirmada", "en_mesa", "pendiente"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border capitalize transition-all ${
                        filterStatus === st
                          ? "bg-orange-500 text-black border-orange-500 font-black"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {st === "todas" ? "Todas" : st === "en_mesa" ? "En Mesa" : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] font-black uppercase text-zinc-400 bg-black/50 border-b border-white/10">
                    <tr>
                      <th className="p-3">Código</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Plan / Experiencia</th>
                      <th className="p-3">Mesa</th>
                      <th className="p-3">Hora</th>
                      <th className="p-3">Pax</th>
                      <th className="p-3">Abono</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono font-bold text-orange-400">
                          #{b.id}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-white block">
                            {b.clientName}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {b.phone}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-300">
                          {b.planName}
                          {b.notes && (
                            <span className="block text-[10px] text-amber-400 italic">
                              {b.notes}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-zinc-200">
                          {b.tableNumber}
                        </td>
                        <td className="p-3 font-mono text-zinc-400">{b.time}</td>
                        <td className="p-3 font-bold text-white">{b.pax} pax</td>
                        <td className="p-3 font-black text-emerald-400">
                          ${b.totalUSD}
                        </td>
                        <td className="p-3">
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleStatusChange(
                                b.id,
                                e.target.value as any
                              )
                            }
                            className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                              b.status === "en_mesa"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : b.status === "confirmada"
                                ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            }`}
                          >
                            <option value="confirmada">Confirmada</option>
                            <option value="en_mesa">En Mesa</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="finalizada">Finalizada</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 2: GESTIÓN DEL MENÚ & PRECIOS */}
        {/* ========================================================= */}
        {activeTab === "menu" && (
          <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-400" />
                  Carta Digital & Precios de The Corner
                </h2>
                <p className="text-xs text-zinc-400">
                  Agrega nuevas pociones, munchies o actualiza precios en tiempo real.
                </p>
              </div>

              <button
                onClick={() => setShowAddMenuModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Agregar Ítem a la Carta
              </button>
            </div>

            {/* Modal para Agregar Ítem */}
            {showAddMenuModal && (
              <form
                onSubmit={handleCreateMenuItem}
                className="p-5 rounded-2xl bg-black/70 border border-orange-500/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-orange-400 uppercase">
                    Nuevo Producto / Poción
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddMenuModal(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Nombre del Producto:
                    </label>
                    <input
                      type="text"
                      value={newMenuName}
                      onChange={(e) => setNewMenuName(e.target.value)}
                      placeholder="Ej. Poción de Maná Violeta"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Precio en USD ($):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newMenuPrice}
                      onChange={(e) => setNewMenuPrice(e.target.value)}
                      placeholder="Ej. 7.5"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Categoría:
                    </label>
                    <select
                      value={newMenuCategory}
                      onChange={(e) => setNewMenuCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    >
                      <option value="pociones">Pociones & Tragos UV</option>
                      <option value="cervezas-shots">Cervezas & Baldes</option>
                      <option value="munchies">Burgers & Munchies</option>
                      <option value="mocktails-cafe">Sin Alcohol & Café</option>
                      <option value="postres">Postres Gamer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Descripción / Ingredientes:
                  </label>
                  <input
                    type="text"
                    value={newMenuDesc}
                    onChange={(e) => setNewMenuDesc(e.target.value)}
                    placeholder="Ej. Ginebra premium, licor de moras, tónica y glitter comestible..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMenuModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 text-black font-black text-xs"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            )}

            {/* Lista de Ítems */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItemsList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-zinc-950/70 border border-white/5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-orange-400">
                        {item.category}
                      </span>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="text-zinc-500 hover:text-rose-400 text-xs"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-sm font-black text-white">{item.name}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-emerald-400">
                        ${item.priceUSD} USD
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        ≈ {(item.priceUSD * bcvRate).toFixed(2)} Bs
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      En Menú
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 3: GESTIÓN DE LUDOTECA */}
        {/* ========================================================= */}
        {activeTab === "ludoteca" && (
          <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-orange-400" />
                  Inventario de Juegos de Mesa ({gamesList.length} Juegos)
                </h2>
                <p className="text-xs text-zinc-400">
                  Agrega nuevos títulos o edita la información de reglas para los Game Masters.
                </p>
              </div>

              <button
                onClick={() => setShowAddGameModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Registrar Nuevo Juego
              </button>
            </div>

            {/* Modal para Agregar Juego */}
            {showAddGameModal && (
              <form
                onSubmit={handleCreateGame}
                className="p-5 rounded-2xl bg-black/70 border border-orange-500/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-orange-400 uppercase">
                    Registrar Nuevo Juego en Ludoteca
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddGameModal(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Nombre del Juego:
                    </label>
                    <input
                      type="text"
                      value={newGameName}
                      onChange={(e) => setNewGameName(e.target.value)}
                      placeholder="Ej. Wingspan"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Jugadores:
                    </label>
                    <input
                      type="text"
                      value={newGamePlayers}
                      onChange={(e) => setNewGamePlayers(e.target.value)}
                      placeholder="Ej. 2 a 5 jugadores"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Duración:
                    </label>
                    <input
                      type="text"
                      value={newGameDuration}
                      onChange={(e) => setNewGameDuration(e.target.value)}
                      placeholder="Ej. 45 min"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Categoría:
                    </label>
                    <select
                      value={newGameCategory}
                      onChange={(e) => setNewGameCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    >
                      <option value="estrategia">Estrategia</option>
                      <option value="party">Party Games</option>
                      <option value="cooperativo">Cooperativo</option>
                      <option value="rol-dnd">Rol & D&D</option>
                      <option value="duelos-1v1">Duelos 1v1</option>
                      <option value="cartas-rapidas">Cartas Rápidas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Descripción / Sinopsis:
                  </label>
                  <input
                    type="text"
                    value={newGameDesc}
                    onChange={(e) => setNewGameDesc(e.target.value)}
                    placeholder="Breve explicación de la temática del juego..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGameModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 text-black font-black text-xs"
                  >
                    Añadir a la Ludoteca
                  </button>
                </div>
              </form>
            )}

            {/* Grid de Juegos */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
              {gamesList.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/5 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-800 text-orange-400">
                      {g.category}
                    </span>
                    <h4 className="text-xs font-black text-white mt-1.5 leading-snug">
                      {g.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {g.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-semibold">
                    <span>👥 {g.players}</span>
                    <span>⏱️ {g.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 4: USUARIOS & STAFF */}
        {/* ========================================================= */}
        {activeTab === "users" && (
          <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  Equipo de Trabajo & Roles de The Corner
                </h2>
                <p className="text-xs text-zinc-400">
                  Control de accesos para Gerentes, Game Masters, Personal de Barra y Validadores.
                </p>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-black font-black text-xs transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Agregar Usuario / Empleado
              </button>
            </div>

            {/* Modal para Agregar Usuario */}
            {showAddUserModal && (
              <form
                onSubmit={handleCreateUser}
                className="p-5 rounded-2xl bg-black/70 border border-sky-500/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-sky-400 uppercase">
                    Registrar Nuevo Empleado / Usuario
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Nombre Completo:
                    </label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Ej. Roberto Sánchez"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Correo Electrónico:
                    </label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Ej. roberto@thecornermcbo.com"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Rol Asignado:
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    >
                      <option value="Gerente General">Gerente General</option>
                      <option value="Game Master">Game Master</option>
                      <option value="Barra / Mixología">Barra / Mixología</option>
                      <option value="Validador Puerta">Validador Puerta</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-500 text-black font-black text-xs"
                  >
                    Crear Acceso
                  </button>
                </div>
              </form>
            )}

            {/* Tabla de Usuarios */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-black uppercase text-zinc-400 bg-black/50 border-b border-white/10">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Último Acceso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {staffUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-mono font-bold text-sky-400">
                        {u.id}
                      </td>
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 text-zinc-400 font-mono">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-zinc-800 text-zinc-200 border border-zinc-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400">{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 5: HISTORIAL DE CLIENTES (CRM) */}
        {/* ========================================================= */}
        {activeTab === "crm" && (
          <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                Historial de Clientes Recurrentes & VIP
              </h2>
              <p className="text-xs text-zinc-400">
                Seguimiento de visitas, consumo acumulado y juegos favoritos de los jugadores.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-black uppercase text-zinc-400 bg-black/50 border-b border-white/10">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Teléfono / WhatsApp</th>
                    <th className="p-3">Visitas</th>
                    <th className="p-3">Consumo Total</th>
                    <th className="p-3">Juego Favorito</th>
                    <th className="p-3">Última Visita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-mono font-bold text-rose-400">
                        {c.id}
                      </td>
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3 text-zinc-400 font-mono">{c.phone}</td>
                      <td className="p-3 font-black text-amber-400">
                        {c.visits} veces
                      </td>
                      <td className="p-3 font-black text-emerald-400">
                        ${c.totalSpentUSD} USD
                      </td>
                      <td className="p-3 text-orange-300 font-semibold">
                        🎲 {c.favoriteGame}
                      </td>
                      <td className="p-3 text-zinc-400">{c.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 6: TASA BCV & CONFIGURACIÓN */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-5">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  Ajuste de Tasa Oficial BCV
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Actualiza la tasa de conversión en Bolívares (VES) que ven los clientes en toda la WebApp.
                </p>
              </div>

              <form onSubmit={handleSaveRate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Tasa Oficial Actual (Bs. por 1 USD):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={tempRate}
                      onChange={(e) => setTempRate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-700 text-sm font-bold text-white"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs shrink-0"
                    >
                      Actualizar Tasa
                    </button>
                  </div>
                </div>

                {rateSuccess && (
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    ¡Tasa actualizada en vivo a {tempRate} Bs!
                  </p>
                )}
              </form>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Enlaces Directos del Dashboard
              </h3>
              <p className="text-xs text-zinc-400">
                Puedes compartir este acceso directo con el equipo administrativo:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[10px] text-zinc-500 font-mono block">Ruta Directa URL:</span>
                  <span className="font-mono text-orange-400 font-bold">/admin</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[10px] text-zinc-500 font-mono block">Parámetro URL:</span>
                  <span className="font-mono text-amber-400 font-bold">/?gerente=true</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
