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
import { formatDualPrice } from "@/data/currencies";
import { Logo } from "@/components/Logo";
import {
  buildWhatsAppTemplate,
  getWhatsAppDirectUrl,
  WhatsAppTriggerType,
} from "@/lib/whatsapp";
import {
  Users,
  Gamepad2,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Utensils,
  QrCode,
  Check,
  X,
  CreditCard,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Building2,
  Send,
  Zap,
  Radio,
  Copy,
  UserPlus,
  Shield,
  Filter,
} from "lucide-react";

type Props = {
  onExitManagerMode: () => void;
  bcvRate: number;
  onUpdateBcvRate?: (newRate: number) => void;
};

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "Gerente General" | "Game Master" | "Barra / Mixología" | "Validador Puerta";
  status: "Activo" | "Inactivo";
  lastLogin: string;
};

export function ManagerDashboard({ onExitManagerMode, bcvRate }: Props) {
  const [activeTab, setActiveTab] = useState<
    "payments" | "overview" | "menu" | "ludoteca" | "users" | "whatsapp"
  >("payments");

  const [bookings, setBookings] = useState<LiveBooking[]>(INITIAL_LIVE_BOOKINGS);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("todos");
  const [paymentSearch, setPaymentSearch] = useState<string>("");

  // WhatsApp Automation State
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTriggerType>("PAYMENT_APPROVED");
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [testPhone, setTestPhone] = useState("+58 412 0308674");
  const [testClientName, setTestClientName] = useState("Luis Torres");
  const [autoOpenWhatsApp, setAutoOpenWhatsApp] = useState(true);
  const [recentNotification, setRecentNotification] = useState<{
    client: string;
    type: string;
    url: string;
  } | null>(null);

  // State: Modal de Captura de Comprobante
  const [previewProofImage, setPreviewProofImage] = useState<string | null>(null);
  const [previewProofTitle, setPreviewProofTitle] = useState<string>("");

  // State: Mesas & Reservas
  const [reservationSearch, setReservationSearch] = useState("");
  const [filterTableStatus, setFilterTableStatus] = useState<string>("todos");

  // State: Menú (CRUD)
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(MENU_ITEMS);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuCategory, setNewMenuCategory] = useState<MenuItem["category"]>("combos-promos");
  const [newMenuDesc, setNewMenuDesc] = useState("");
  const [menuFilterCategory, setMenuFilterCategory] = useState<string>("todos");

  // State: Ludoteca (CRUD)
  const [gamesList, setGamesList] = useState<BoardGame[]>(BOARD_GAMES);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [newGamePlayers, setNewGamePlayers] = useState("2 a 4 personas");
  const [newGameDuration, setNewGameDuration] = useState("20-30 min");
  const [newGameDifficulty, setNewGameDifficulty] = useState<BoardGame["difficulty"]>("Fácil & Rápido");
  const [newGameCategory, setNewGameCategory] = useState<BoardGame["category"]>("party");
  const [newGameDesc, setNewGameDesc] = useState("");
  const [gameFilterCategory, setGameFilterCategory] = useState<string>("todos");

  // State: Staff
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    {
      id: "USR-01",
      name: "Paul David",
      email: "gerencia@thecornermcbo.com",
      role: "Gerente General",
      status: "Activo",
      lastLogin: "En línea ahora",
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
      lastLogin: "Hoy 18:00",
    },
    {
      id: "USR-04",
      name: "José Rincón",
      email: "puerta@thecornermcbo.com",
      role: "Validador Puerta",
      status: "Activo",
      lastLogin: "Ayer 20:30",
    },
  ]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffUser["role"]>("Game Master");

  // Contadores
  const pendingPaymentsCount = bookings.filter((b) => b.paymentStatus === "pendiente").length;
  const activeTablesCount = bookings.filter((b) => b.status === "en_mesa" || b.status === "confirmada").length;

  // Acciones de Pagos con Automatización WhatsApp
  const handleApprovePayment = (booking: LiveBooking) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
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

    const message = buildWhatsAppTemplate({
      type: "PAYMENT_APPROVED",
      clientName: booking.clientName,
      phone: booking.phone,
      ticketCode: booking.id,
      planName: booking.planName,
      date: booking.date,
      time: booking.time,
      pax: booking.pax,
      totalUSD: booking.totalUSD,
    });

    const directUrl = getWhatsAppDirectUrl(booking.phone, message);

    setRecentNotification({
      client: booking.clientName,
      type: "Pase QR Aprobado",
      url: directUrl,
    });

    if (autoOpenWhatsApp) {
      window.open(directUrl, "_blank");
    }
  };

  const handleRejectPayment = (booking: LiveBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, paymentStatus: "rechazado" } : b))
    );

    const message = buildWhatsAppTemplate({
      type: "PAYMENT_REJECTED",
      clientName: booking.clientName,
      phone: booking.phone,
      ticketCode: booking.id,
      paymentRef: booking.paymentReference,
    });

    const directUrl = getWhatsAppDirectUrl(booking.phone, message);
    if (autoOpenWhatsApp) {
      window.open(directUrl, "_blank");
    }
  };

  const handleUpdateBookingStatus = (id: string, newStatus: LiveBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleAssignTable = (id: string) => {
    const table = prompt("Ingresa el número de mesa (ej. Mesa 5 / Zona VIP):");
    if (table && table.trim()) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, tableNumber: table.trim() } : b))
      );
    }
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName.trim() || !newMenuPrice) return;

    const newItem: MenuItem = {
      id: `menu-custom-${Date.now()}`,
      name: newMenuName.trim(),
      priceUSD: parseFloat(newMenuPrice) || 5,
      category: newMenuCategory,
      description: newMenuDesc.trim() || "Especial de la casa The Corner.",
      popular: true,
      tags: ["Nuevo"],
    };

    setMenuItemsList((prev) => [newItem, ...prev]);
    setShowAddMenuModal(false);
    setNewMenuName("");
    setNewMenuPrice("");
    setNewMenuDesc("");
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItemsList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) return;

    const newGame: BoardGame = {
      id: `game-custom-${Date.now()}`,
      name: newGameName.trim(),
      players: newGamePlayers,
      duration: newGameDuration,
      difficulty: newGameDifficulty,
      category: newGameCategory,
      description: newGameDesc.trim() || "Juego disponible en la ludoteca de The Corner.",
      rulesSummary: "Solicítalo al Game Master o mesero en turno.",
      popular: true,
      tags: ["Disponible"],
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      minPlayers: 2,
      maxPlayers: 6,
      minMinutes: 20,
    };

    setGamesList((prev) => [newGame, ...prev]);
    setShowAddGameModal(false);
    setNewGameName("");
    setNewGameDesc("");
  };

  const handleDeleteGame = (id: string) => {
    setGamesList((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    const newStaff: StaffUser = {
      id: `USR-0${staffUsers.length + 1}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: newStaffRole,
      status: "Activo",
      lastLogin: "Nuevo",
    };

    setStaffUsers((prev) => [...prev, newStaff]);
    setShowAddStaffModal(false);
    setNewStaffName("");
    setNewStaffEmail("");
  };

  const handleToggleStaffStatus = (id: string) => {
    setStaffUsers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "Activo" ? "Inactivo" : "Activo" } : s
      )
    );
  };

  const handleDeleteStaff = (id: string) => {
    setStaffUsers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSendBroadcastReminder = () => {
    const confirmed = bookings.filter((b) => b.paymentStatus === "aprobado" || b.status === "confirmada");
    if (confirmed.length === 0) {
      alert("No hay reservas confirmadas para enviar recordatorio.");
      return;
    }

    const first = confirmed[0];
    const msg = buildWhatsAppTemplate({
      type: "EVENT_REMINDER",
      clientName: first.clientName,
      phone: first.phone,
      ticketCode: first.id,
      planName: first.planName,
      time: first.time,
    });
    window.open(getWhatsAppDirectUrl(first.phone, msg), "_blank");
  };

  // Filtrados
  const filteredBookings = bookings.filter((b) => {
    if (filterPaymentStatus !== "todos" && b.paymentStatus !== filterPaymentStatus) return false;
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

  const filteredReservations = bookings.filter((b) => {
    if (filterTableStatus !== "todos" && b.status !== filterTableStatus) return false;
    if (reservationSearch.trim()) {
      const q = reservationSearch.toLowerCase();
      return (
        b.clientName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.tableNumber?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredMenuItems = menuItemsList.filter((item) => {
    if (menuFilterCategory !== "todos" && item.category !== menuFilterCategory) return false;
    return true;
  });

  const filteredGames = gamesList.filter((game) => {
    if (gameFilterCategory !== "todos" && game.category !== gameFilterCategory) return false;
    return true;
  });

  const previewTemplateMessage = buildWhatsAppTemplate({
    type: selectedTemplate,
    clientName: testClientName,
    phone: testPhone,
    ticketCode: "CRN-8492",
    planName: "Paquete 1 (5 Personas)",
    date: "Viernes",
    time: "08:00 PM",
    pax: 5,
    totalUSD: 50,
    paymentMethod: "pago_movil",
    paymentRef: "849201",
  });

  return (
    <div className="min-h-screen bg-[#07070B] text-zinc-100 pt-8 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitManagerMode}
              className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la WebApp</span>
            </button>
            <Logo size="sm" withText />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase">
              Gerencia
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-black/60 border border-white/5 font-mono text-zinc-300">
              📊 {activeTablesCount} Mesas Activas
            </span>
          </div>
        </div>

        {/* Notificación Flotante de WhatsApp */}
        {recentNotification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black">
                <MessageCircle className="w-4 h-4 fill-black" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">
                  ¡Automatización WhatsApp Lista para {recentNotification.client}!
                </span>
                <span className="text-[11px] text-emerald-300">
                  {recentNotification.type} con pase QR activo listo.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={recentNotification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs flex items-center gap-1.5"
              >
                <span>Re-enviar Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setRecentNotification(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs (Sin Tasa BCV ni Ajustes) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { id: "payments", label: "💰 Gestión de Pagos", badge: pendingPaymentsCount },
            { id: "overview", label: "🎟️ Mesas & Reservas" },
            { id: "menu", label: "🍔 Menú & Promos" },
            { id: "ludoteca", label: "🎲 Ludoteca & Juegos" },
            { id: "users", label: "👥 Usuarios & Staff" },
            { id: "whatsapp", label: "📱 Automatizaciones WhatsApp" },
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

        {/* =========================================================================
            TAB 1: GESTIÓN DE PAGOS Y CONCILIACIÓN
           ========================================================================= */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Conciliación & Aprobación de Pagos
                </h2>
                <p className="text-xs text-zinc-400">
                  Verifica las transferencias de Pago Móvil, Zelle o Binance y aprueba la emisión del QR oficial con WhatsApp automático.
                </p>
              </div>

              {/* Toggle Auto WhatsApp */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                  <input
                    type="checkbox"
                    checked={autoOpenWhatsApp}
                    onChange={(e) => setAutoOpenWhatsApp(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Auto-despachar WhatsApp al Aprobar</span>
                </label>

                {/* Filtros */}
                <div className="flex items-center gap-1">
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

                          {/* Botón Ver Captura si existe */}
                          {b.proofUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewProofImage(b.proofUrl!);
                                setPreviewProofTitle(`Comprobante de ${b.clientName} (#${b.id})`);
                              }}
                              className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold transition-all"
                            >
                              <span>📸 Ver Captura</span>
                            </button>
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
                                  onClick={() => handleApprovePayment(b)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aprobar & Enviar QR</span>
                                </button>

                                <button
                                  onClick={() => handleRejectPayment(b)}
                                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold"
                                  title="Rechazar pago"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            <a
                              href={getWhatsAppDirectUrl(
                                b.phone,
                                buildWhatsAppTemplate({
                                  type: b.paymentStatus === "aprobado" ? "PAYMENT_APPROVED" : "TICKET_CREATED",
                                  clientName: b.clientName,
                                  phone: b.phone,
                                  ticketCode: b.id,
                                  planName: b.planName,
                                  date: b.date,
                                  time: b.time,
                                  pax: b.pax,
                                  totalUSD: b.totalUSD,
                                  paymentMethod: b.paymentMethod,
                                  paymentRef: b.paymentReference,
                                })
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400"
                              title="Abrir WhatsApp oficial"
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

        {/* =========================================================================
            TAB 2: MESAS & RESERVAS (OVERVIEW)
           ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-orange-400" />
                  Monitor de Mesas & Reservas en Vivo
                </h2>
                <p className="text-xs text-zinc-400">
                  Control de asistencia en puerta, asignación de mesas y estado de cada grupo.
                </p>
              </div>

              {/* Filtros de Mesas */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {["todos", "en_mesa", "confirmada", "pendiente", "finalizada"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterTableStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                      filterTableStatus === st
                        ? "bg-orange-500 text-black font-black"
                        : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Búsqueda */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reservationSearch}
                onChange={(e) => setReservationSearch(e.target.value)}
                placeholder="Buscar por cliente, #ticket o número de mesa..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Grid de Mesas / Tarjetas de Reserva */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReservations.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-orange-400">
                        #{booking.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          booking.status === "en_mesa"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : booking.status === "confirmada"
                            ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            : booking.status === "pendiente"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-base text-white">{booking.clientName}</h3>
                      <p className="text-xs text-zinc-400 font-medium">{booking.phone}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1 text-xs">
                      <p className="text-zinc-300">
                        <strong className="text-orange-400">Paquete:</strong> {booking.planName}
                      </p>
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Invitados:</strong> {booking.pax} pax
                      </p>
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Hora:</strong> {booking.date} · {booking.time}
                      </p>
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Mesa:</strong>{" "}
                        <span className="font-bold text-white">{booking.tableNumber || "Por Asignar"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Acciones de Mesa */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleAssignTable(booking.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                    >
                      Asignar Mesa
                    </button>

                    <div className="flex items-center gap-1.5">
                      {booking.status !== "en_mesa" && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, "en_mesa")}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs"
                        >
                          En Mesa
                        </button>
                      )}
                      {booking.status === "en_mesa" && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, "finalizada")}
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold"
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: MENÚ & PROMOS
           ========================================================================= */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  Gestión de Menú, Narguiles & Promos
                </h2>
                <p className="text-xs text-zinc-400">
                  Agrega, edita precios o retira platos, baldes de cerveza o cócteles en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddMenuModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Producto</span>
                </button>
              </div>
            </div>

            {/* Filtros de Categorías */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: "todos", label: "Todos los Ítems" },
                { id: "combos-promos", label: "Promos & Baldes" },
                { id: "narguiles-shots", label: "Narguiles & Shots" },
                { id: "cocteles-botellas", label: "Cócteles & Tragos" },
                { id: "comida-munchies", label: "Comida & Munchies" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMenuFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    menuFilterCategory === cat.id
                      ? "bg-orange-500 text-black font-black"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid de Ítems */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-orange-400 px-2 py-0.5 rounded bg-orange-500/10">
                        {item.category}
                      </span>
                      <span className="font-black text-white text-base">
                        ${item.priceUSD.toFixed(2)}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">{item.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-emerald-400">✓ En Carta</span>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Eliminar ítem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: LUDOTECA & JUEGOS
           ========================================================================= */}
        {activeTab === "ludoteca" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-purple-400" />
                  Catálogo de Juegos de Mesa & Arcade
                </h2>
                <p className="text-xs text-zinc-400">
                  Administra la colección de juegos disponibles para los clientes en las mesas.
                </p>
              </div>

              <button
                onClick={() => setShowAddGameModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Juego</span>
              </button>
            </div>

            {/* Grid de Juegos */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-purple-400 px-2 py-0.5 rounded bg-purple-500/10">
                        {game.category}
                      </span>
                      <span className="text-[11px] font-bold text-zinc-400">
                        {game.players}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-white">{game.name}</h3>
                    <p className="text-xs text-zinc-400">{game.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-300">
                        ⏱️ {game.duration}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-300">
                        🎲 {game.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400">● Disponible en barra</span>
                    <button
                      onClick={() => handleDeleteGame(game.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Eliminar juego"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: USUARIOS & STAFF
           ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  Equipo & Staff de The Corner
                </h2>
                <p className="text-xs text-zinc-400">
                  Control de accesos y roles del equipo (Gerentes, Game Masters, Barra y Validador de Puerta).
                </p>
              </div>

              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>Agregar Miembro</span>
              </button>
            </div>

            {/* Tabla de Staff */}
            <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-[10px] uppercase font-black tracking-wider text-zinc-400 border-b border-white/5">
                  <tr>
                    <th className="p-4">Miembro / ID</th>
                    <th className="p-4">Rol en Sala</th>
                    <th className="p-4">Correo</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Último Acceso</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {staffUsers.map((staff) => (
                    <tr key={staff.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white block text-sm">{staff.name}</span>
                        <span className="font-mono text-[10px] text-zinc-500">{staff.id}</span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[11px] font-bold">
                          {staff.role}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-zinc-300">{staff.email}</td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStaffStatus(staff.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                            staff.status === "Activo"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {staff.status}
                        </button>
                      </td>

                      <td className="p-4 text-zinc-400">{staff.lastLogin}</td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400"
                          title="Eliminar miembro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: CENTRO DE AUTOMATIZACIONES DE WHATSAPP
           ========================================================================= */}
        {activeTab === "whatsapp" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  Centro de Automatizaciones de WhatsApp
                </h2>
                <p className="text-xs text-zinc-400">
                  Configuración de plantillas automáticas, despachadores y difusión de recordatorios masivos.
                </p>
              </div>

              <button
                onClick={handleSendBroadcastReminder}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Radio className="w-4 h-4" />
                <span>📢 Difusión Masiva de Recordatorio Hoy</span>
              </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Columna Izquierda: Selector de Plantillas */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-black uppercase text-zinc-400 tracking-wider block">
                  Plantillas Automatizadas Disponibles:
                </span>

                {[
                  {
                    type: "PAYMENT_APPROVED" as WhatsAppTriggerType,
                    title: "🎉 Aprobación de Pago & QR Activo",
                    desc: "Se envía automáticamente al presionar 'Aprobar Pago'. Activa el pase QR.",
                  },
                  {
                    type: "TICKET_CREATED" as WhatsAppTriggerType,
                    title: "🎟️ Registro & Espera de Comprobante",
                    desc: "Se envía cuando el cliente reporta su reserva en la WebApp.",
                  },
                  {
                    type: "PAYMENT_REJECTED" as WhatsAppTriggerType,
                    title: "⚠️ Novedad / Comprobante Inválido",
                    desc: "Solicita al cliente re-enviar la captura o referencia correcta.",
                  },
                  {
                    type: "EVENT_REMINDER" as WhatsAppTriggerType,
                    title: "⏰ Recordatorio del Día del Evento",
                    desc: "Recuerda la hora de llegada, mapa GPS y servicios de The Corner.",
                  },
                  {
                    type: "ORDER_PLACED" as WhatsAppTriggerType,
                    title: "🍔 Comanda Digital a Cocina / Barra",
                    desc: "Envía el detalle de pedidos directos en mesa.",
                  },
                ].map((tpl) => (
                  <div
                    key={tpl.type}
                    onClick={() => setSelectedTemplate(tpl.type)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedTemplate === tpl.type
                        ? "bg-zinc-900 border-emerald-500 shadow-lg shadow-emerald-500/10"
                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <h4 className="text-xs font-black text-white">{tpl.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-1">{tpl.desc}</p>
                  </div>
                ))}
              </div>

              {/* Columna Derecha: Vista Previa y Probador en Vivo */}
              <div className="lg:col-span-7 space-y-4 rounded-3xl bg-zinc-950/80 border border-zinc-800 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase text-white">
                      Vista Previa del Mensaje Oficial
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(previewTemplateMessage);
                      setCopiedMsg(true);
                      setTimeout(() => setCopiedMsg(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 font-bold"
                  >
                    {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMsg ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>

                {/* Burbuja Estilo WhatsApp */}
                <div className="p-4 rounded-2xl bg-[#0b241b] border border-emerald-500/30 font-sans text-xs text-zinc-100 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {previewTemplateMessage}
                </div>

                {/* Simulador de Envío */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <span className="text-[11px] font-bold text-zinc-400 block uppercase">
                    Probar Envío de Automatización:
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={testClientName}
                      onChange={(e) => setTestClientName(e.target.value)}
                      placeholder="Nombre del Cliente"
                      className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                    <input
                      type="tel"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="Número (+58...)"
                      className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                    />
                  </div>

                  <a
                    href={getWhatsAppDirectUrl(testPhone, previewTemplateMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                  >
                    <Send className="w-4 h-4 fill-black" />
                    <span>Lanzar Prueba de WhatsApp en Vivo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: AGREGAR PLATO AL MENÚ */}
        {showAddMenuModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-orange-500/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-black text-base text-white uppercase">
                  Agregar Ítem al Menú
                </h3>
                <button onClick={() => setShowAddMenuModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMenuItem} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Nombre del Producto:</label>
                  <input
                    type="text"
                    required
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    placeholder="Ej. Balde Extra Frío (10 Cervezas)"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Precio ($ USD):</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newMenuPrice}
                      onChange={(e) => setNewMenuPrice(e.target.value)}
                      placeholder="10.00"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Categoría:</label>
                    <select
                      value={newMenuCategory}
                      onChange={(e) => setNewMenuCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                    >
                      <option value="combos-promos">Promos & Baldes</option>
                      <option value="narguiles-shots">Narguiles & Shots</option>
                      <option value="cocteles-botellas">Cócteles & Tragos</option>
                      <option value="comida-munchies">Comida & Munchies</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Descripción:</label>
                  <textarea
                    rows={2}
                    value={newMenuDesc}
                    onChange={(e) => setNewMenuDesc(e.target.value)}
                    placeholder="Detalles del producto o promo..."
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMenuModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-500 text-black font-black"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AGREGAR JUEGO A LA LUDOTECA */}
        {showAddGameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-purple-500/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-black text-base text-white uppercase">
                  Agregar Juego a Ludoteca
                </h3>
                <button onClick={() => setShowAddGameModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddGame} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Nombre del Juego:</label>
                  <input
                    type="text"
                    required
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    placeholder="Ej. Mario Kart Deluxe / Catán"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Jugadores:</label>
                    <input
                      type="text"
                      value={newGamePlayers}
                      onChange={(e) => setNewGamePlayers(e.target.value)}
                      placeholder="2 a 6 personas"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Duración:</label>
                    <input
                      type="text"
                      value={newGameDuration}
                      onChange={(e) => setNewGameDuration(e.target.value)}
                      placeholder="20-30 min"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Descripción corta:</label>
                  <textarea
                    rows={2}
                    value={newGameDesc}
                    onChange={(e) => setNewGameDesc(e.target.value)}
                    placeholder="Reglas rápidas o temática del juego..."
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGameModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-500 text-white font-black"
                  >
                    Guardar Juego
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AGREGAR STAFF */}
        {showAddStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-sky-500/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-black text-base text-white uppercase">
                  Agregar Miembro al Equipo
                </h3>
                <button onClick={() => setShowAddStaffModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="Ej. Roberto Medina"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="staff@thecornermcbo.com"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Rol / Cargo:</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white"
                  >
                    <option value="Gerente General">Gerente General</option>
                    <option value="Game Master">Game Master</option>
                    <option value="Barra / Mixología">Barra / Mixología</option>
                    <option value="Validador Puerta">Validador Puerta</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-500 text-black font-black"
                  >
                    Registrar Miembro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: VER CAPTURA DE COMPROBANTE DE PAGO */}
        {previewProofImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-orange-500/50 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-black text-sm text-white uppercase truncate pr-2">
                  📸 {previewProofTitle || "Comprobante de Pago"}
                </h3>
                <button
                  onClick={() => setPreviewProofImage(null)}
                  className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center p-2">
                <img
                  src={previewProofImage}
                  alt="Captura del Comprobante"
                  className="max-h-[65vh] w-auto object-contain rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewProofImage(null)}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 text-black font-black text-xs uppercase"
                >
                  Cerrar Vista Previa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
