"use client";

import { useState } from "react";
import {
  INITIAL_MANAGER_KPIS,
  INITIAL_LIVE_BOOKINGS,
  LiveBooking,
  BOARD_GAMES,
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
  Play,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Search,
  Plus,
  RefreshCw,
} from "lucide-react";

type Props = {
  onExitManagerMode: () => void;
  bcvRate: number;
  onUpdateBcvRate: (newRate: number) => void;
};

export function ManagerDashboard({
  onExitManagerMode,
  bcvRate,
  onUpdateBcvRate,
}: Props) {
  const [kpis, setKpis] = useState(INITIAL_MANAGER_KPIS);
  const [bookings, setBookings] = useState<LiveBooking[]>(INITIAL_LIVE_BOOKINGS);
  const [tempRate, setTempRate] = useState<string>(bcvRate.toString());
  const [rateSuccess, setRateSuccess] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("todas");

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
    {
      gameId: "dixit",
      gameName: "Dixit: Odisea",
      table: "Mesa 7",
      time: "07:45 PM",
    },
  ]);

  const [newLoanGame, setNewLoanGame] = useState<string>(BOARD_GAMES[0].name);
  const [newLoanTable, setNewLoanTable] = useState<string>("Mesa 1");

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

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "todas") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#07070a] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Barra Superior del Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white uppercase tracking-tight">
                  Panel del Gerente · The Corner
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  EN VIVO
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Control de mesas, préstamos de ludoteca, comandas y tasa de cambio BCV.
              </p>
            </div>
          </div>

          <button
            onClick={onExitManagerMode}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs transition-all border border-zinc-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Vista de Clientes</span>
          </button>
        </div>

        {/* Tarjetas KPI de Rendimiento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase">Mesas Activas</span>
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {kpis.activeTables}
              </span>
              <span className="text-xs text-zinc-500">/ {kpis.totalTables}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full"
                style={{
                  width: `${(kpis.activeTables / kpis.totalTables) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase">Juegos en Mesa</span>
              <Gamepad2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                {loanedGames.length}
              </span>
              <span className="text-xs text-zinc-500">/ {kpis.totalGames}</span>
            </div>
            <span className="text-[11px] text-zinc-400 block truncate">
              Asesores de juego en sala
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase">Ventas del Día</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                ${kpis.todaySalesUSD}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">USD</span>
            </div>
            <span className="text-[10px] text-zinc-500 block truncate">
              ≈ {(kpis.todaySalesUSD * bcvRate).toLocaleString("es-VE")} Bs.
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold uppercase">Ticket Promedio</span>
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-white">
                ${kpis.avgTicketUSD}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">/ pax</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              +14% vs semana anterior
            </span>
          </div>
        </div>

        {/* Fila Central: Gestor de Tasa de Cambio & Monitor de Juegos Prestados */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Editor de Tasa BCV */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-zinc-900/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                Tasa de Cambio Oficial (Bs/USD)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                BCV
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Esta tasa actualiza automáticamente todos los precios en Bolívares (VES) del menú, reservas y comandas.
            </p>

            <form onSubmit={handleSaveRate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Tasa actual de referencia (Bs):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs transition-all shrink-0"
                  >
                    Actualizar
                  </button>
                </div>
              </div>

              {rateSuccess && (
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  ¡Tasa actualizada a {tempRate} Bs!
                </p>
              )}
            </form>
          </div>

          {/* Monitor de Ludoteca en Vivo (Qué juego está en qué mesa) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-zinc-900/80 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" />
                  Control de Juegos Prestados a Mesas
                </h3>
                <p className="text-xs text-zinc-400">
                  {loanedGames.length} juegos en juego actualmente en sala.
                </p>
              </div>

              {/* Registro rápido de préstamo */}
              <form onSubmit={handleAddLoan} className="flex items-center gap-2">
                <select
                  value={newLoanGame}
                  onChange={(e) => setNewLoanGame(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-zinc-700 text-xs text-zinc-200"
                >
                  {BOARD_GAMES.slice(0, 15).map((g) => (
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
                  className="w-20 px-2 py-1.5 rounded-lg bg-black/60 border border-zinc-700 text-xs text-white"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs flex items-center justify-center shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Lista de Préstamos */}
            <div className="grid sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {loanedGames.map((loan, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {loan.gameName}
                    </span>
                    <span className="text-[10px] text-orange-400 font-semibold">
                      📍 {loan.table} · ⏱️ {loan.time}
                    </span>
                  </div>

                  <button
                    onClick={() => handleReturnLoan(idx)}
                    className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 text-[10px] font-bold text-zinc-400 hover:text-emerald-300 border border-zinc-700 hover:border-emerald-500/30 transition-all shrink-0"
                  >
                    Devolver
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección Inferior: Control de Mesas y Reservas del Día */}
        <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                Reservas y Mesas de Hoy
              </h2>
              <p className="text-xs text-zinc-400">
                Cambia el estado de los comensales y valida pases QR en tiempo real.
              </p>
            </div>

            {/* Filtro de Estados */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: "todas", label: "Todas" },
                { id: "confirmada", label: "Confirmadas" },
                { id: "en_mesa", label: "En Mesa" },
                { id: "pendiente", label: "Pendientes" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    filterStatus === st.id
                      ? "bg-orange-500 text-black border-orange-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Reservas */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-black uppercase text-zinc-400 bg-black/50 border-b border-white/10">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Plan / Experiencia</th>
                  <th className="p-3">Mesa Asignada</th>
                  <th className="p-3">Hora</th>
                  <th className="p-3">Pax</th>
                  <th className="p-3">Abono</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-mono font-bold text-orange-400">
                      #{b.id}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-white block">
                        {b.clientName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {b.phone}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-300">
                      {b.planName}
                      {b.notes && (
                        <span className="block text-[10px] text-amber-400/80 italic truncate max-w-xs">
                          {b.notes}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-zinc-300">
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
                            e.target.value as
                              | "confirmada"
                              | "en_mesa"
                              | "pendiente"
                              | "finalizada"
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          b.status === "en_mesa"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : b.status === "confirmada"
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                            : b.status === "pendiente"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
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
    </div>
  );
}
