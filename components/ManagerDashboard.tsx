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
  buildWhatsAppTemplate,
  getWhatsAppDirectUrl,
  WhatsAppTriggerType,
} from "@/lib/whatsapp";
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
  Send,
  Zap,
  Radio,
  Copy,
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

export function ManagerDashboard({
  onExitManagerMode,
  bcvRate,
  onUpdateBcvRate,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "payments" | "overview" | "whatsapp" | "menu" | "ludoteca" | "users" | "settings"
  >("payments");

  const [kpis, setKpis] = useState(INITIAL_MANAGER_KPIS);
  const [bookings, setBookings] = useState<LiveBooking[]>(INITIAL_LIVE_BOOKINGS);
  const [tempRate, setTempRate] = useState<string>(bcvRate.toString());
  const [rateSuccess, setRateSuccess] = useState<boolean>(false);
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

    // Construir mensaje oficial de WhatsApp de aprobación
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

  const handleSendBroadcastReminder = () => {
    const confirmed = bookings.filter((b) => b.paymentStatus === "aprobado" || b.status === "confirmada");
    if (confirmed.length === 0) {
      alert("No hay reservas confirmadas para enviar recordatorio.");
      return;
    }

    // Abrir el primer chat y notificar
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

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempRate);
    if (!isNaN(val) && val > 0) {
      onUpdateBcvRate(val);
      setRateSuccess(true);
      setTimeout(() => setRateSuccess(false), 3000);
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItemsList((prev) => prev.filter((i) => i.id !== id));
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

  // Mensaje de preview para el simulador de automatizaciones
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

        {/* Notificación Flotante de Automatización */}
        {recentNotification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black">
                <MessageCircle className="w-5 h-5 fill-black" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">
                  ¡Automatización WhatsApp Lista para {recentNotification.client}!
                </span>
                <span className="text-[11px] text-emerald-300">
                  {recentNotification.type} con pase QR activo generado.
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { id: "payments", label: "💰 Gestión de Pagos", badge: pendingPaymentsCount },
            { id: "whatsapp", label: "📱 Automatizaciones WhatsApp" },
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

        {/* TAB 1: GESTIÓN DE PAGOS Y CONCILIACIÓN */}
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

                            {/* Botón WhatsApp */}
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

        {/* TAB 2: CENTRO DE AUTOMATIZACIONES DE WHATSAPP (PARRANDÓN) */}
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
                    desc: "Recuerda la hora de llegada, mapa GPS y comodidades de Costa Verde.",
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

        {/* TAB 3: MENÚ & PROMOS */}
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

        {/* TAB 4: AJUSTES & TASA BCV */}
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
