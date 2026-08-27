"use client";

import { useState } from "react";
import {
  CELEBRATION_PACKAGES,
  CelebrationPackage,
  PAYMENT_ACCOUNTS,
  PaymentMethod,
} from "@/data/cornerData";
import { CurrencyMode, formatPrice, formatDualPrice } from "@/data/currencies";
import {
  PartyPopper,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Crown,
  Copy,
  Check,
  CreditCard,
  Building2,
  DollarSign,
  Smartphone,
  Upload,
  Image as ImageIcon,
  Trash2,
  Camera,
} from "lucide-react";

export type BookingData = {
  code: string;
  plan: {
    id: string;
    name: string;
    priceUSD: number;
  };
  date: string;
  time: string;
  pax: number;
  name: string;
  phone: string;
  notes: string;
  totalUSD: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentBank?: string;
  paymentStatus: "pendiente" | "aprobado";
  proofUrl?: string;
};

type Props = {
  currency: CurrencyMode;
  bcvRate: number;
  onGenerateQrTicket: (bookingData: BookingData) => void;
};

export function BookingSection({
  currency,
  bcvRate,
  onGenerateQrTicket,
}: Props) {
  const [selectedPackage, setSelectedPackage] = useState<CelebrationPackage>(
    CELEBRATION_PACKAGES[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>("Viernes");
  const [selectedTime, setSelectedTime] = useState<string>("08:00 PM");
  const [pax, setPax] = useState<number>(5);
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientNotes, setClientNotes] = useState<string>("");

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pago_movil");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [paymentBank, setPaymentBank] = useState<string>("Banesco");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const dateOptions = ["Hoy", "Mañana", "Viernes", "Sábado", "Domingo", "Próxima Semana"];
  const timeSlots = [
    "06:30 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:30 PM",
    "10:30 PM",
  ];

  const totalUSD = selectedPackage.priceUSD;
  const dualPrice = formatDualPrice(totalUSD, bcvRate);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Por favor, selecciona un archivo de imagen válido (JPG, PNG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("La imagen es muy pesada. Por favor selecciona una captura menor a 5MB.");
      return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setProofUrl(event.target?.result as string);
      setIsReadingFile(false);
      setErrorMsg("");
    };
    reader.onerror = () => {
      setErrorMsg("Error al leer el archivo de la captura.");
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg("Por favor, ingresa tu nombre completo.");
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMsg("Por favor, ingresa tu número de WhatsApp.");
      return;
    }

    if (paymentMethod !== "efectivo" && !paymentReference.trim() && !proofUrl) {
      setErrorMsg("Por favor, ingresa el número de referencia o adjunta la captura del pago.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = `CRN-${Math.floor(1000 + Math.random() * 9000)}`;
      onGenerateQrTicket({
        code: generatedCode,
        plan: {
          id: selectedPackage.id,
          name: selectedPackage.name,
          priceUSD: selectedPackage.priceUSD,
        },
        date: selectedDate,
        time: selectedTime,
        pax,
        name: clientName,
        phone: clientPhone,
        notes: clientNotes,
        totalUSD,
        paymentMethod,
        paymentReference: paymentReference.trim() || undefined,
        paymentBank: paymentMethod === "pago_movil" ? paymentBank : undefined,
        paymentStatus: "pendiente",
        proofUrl: proofUrl || undefined,
      });
    }, 300);
  };

  return (
    <section id="paquetes" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#0B0B11] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
            <PartyPopper className="w-4 h-4" />
            ¡CELEBRA EN CORNER — EL CUMPLEAÑERO NO PAGA!
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Reserva tu Paquete & Genera tu Pase QR
          </h2>
          <p className="text-sm sm:text-base text-zinc-300">
            Elige tu paquete, reporta tu método de pago (Pago Móvil, Zelle, Binance o Efectivo) y obtén tu pase digital para ingresar a The Corner en C.C. Costa Verde.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Grid de los 4 Paquetes Oficiales */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-orange-400" />
                1. Selecciona tu Paquete de Celebración:
              </h3>
              <span className="text-[10px] font-bold text-orange-400">
                4 Paquetes Disponibles
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {CELEBRATION_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      if (pkg.packageNumber === 1) setPax(5);
                      if (pkg.packageNumber === 2) setPax(10);
                      if (pkg.packageNumber === 3) setPax(15);
                      if (pkg.packageNumber === 4) setPax(25);
                    }}
                    className={`cursor-pointer rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-b from-zinc-900 via-[#161622] to-black border-orange-500 shadow-2xl shadow-orange-500/20 scale-[1.02]"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-500 text-black">
                          {pkg.pax}
                        </span>
                        <span className="text-xl font-black text-white">
                          {formatPrice(pkg.priceUSD, currency, bcvRate)}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white uppercase tracking-tight">
                        {pkg.name}
                      </h4>

                      <ul className="mt-3.5 space-y-1.5 text-xs text-zinc-300">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase">
                        {pkg.tier === "Premium" ? "🌟 Nivel Premium" : "⚡ Nivel Básico"}
                      </span>
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-xl transition-colors ${
                          isSelected
                            ? "bg-orange-500 text-black"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {isSelected ? "Seleccionado ✓" : "Elegir"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Wizard de Reserva con Pasarela de Pago & Pase QR */}
          <div className="lg:col-span-5 space-y-5 bg-zinc-950/90 border border-orange-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              2. Fecha, Hora y Datos del Anfitrión
            </h3>

            {/* Fecha & Hora en 2 columnas compactas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                  Día:
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {dateOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                  Hora de Llegada:
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personas (PAX) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  Invitados Estimados:
                </span>
                <span className="text-orange-400 font-black text-xs">
                  {pax} personas
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                value={pax}
                onChange={(e) => setPax(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Datos de Contacto */}
            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                  Nombre / Anfitrión:
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Sofía Mendoza"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                  WhatsApp:
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+58 412 1234567"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* SECCIÓN DE PAGOS SIMILAR AL PARRANDÓN */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  3. Método de Pago & Conciliación
                </h3>
                <span className="text-[10px] font-bold text-emerald-400">
                  Total: {dualPrice.usd} (≈ {dualPrice.ves})
                </span>
              </div>

              {/* Selector de Método */}
              <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                {[
                  { id: "pago_movil", label: "Pago Móvil", icon: Smartphone },
                  { id: "zelle", label: "Zelle", icon: DollarSign },
                  { id: "binance", label: "Binance", icon: Building2 },
                  { id: "efectivo", label: "Efectivo", icon: CreditCard },
                ].map((m) => {
                  const Icon = m.icon;
                  const isCurrent = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                        isCurrent
                          ? "bg-gradient-to-b from-emerald-500 to-teal-600 text-black border-emerald-400 font-black shadow-md"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Caja de Datos de Pago Según el Método */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs">
                {paymentMethod === "pago_movil" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Banco:</span>
                      <span className="font-bold text-white">
                        {PAYMENT_ACCOUNTS.pagoMovil.banco}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Teléfono:</span>
                      <span className="font-mono font-bold text-white flex items-center gap-1">
                        {PAYMENT_ACCOUNTS.pagoMovil.telefono}
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              PAYMENT_ACCOUNTS.pagoMovil.telefonoRaw,
                              "pm_tel"
                            )
                          }
                          className="p-1 hover:text-orange-400"
                          title="Copiar teléfono"
                        >
                          {copiedField === "pm_tel" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">C.I. / RIF:</span>
                      <span className="font-mono font-bold text-white flex items-center gap-1">
                        {PAYMENT_ACCOUNTS.pagoMovil.ci}
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              PAYMENT_ACCOUNTS.pagoMovil.ci,
                              "pm_ci"
                            )
                          }
                          className="p-1 hover:text-orange-400"
                          title="Copiar C.I."
                        >
                          {copiedField === "pm_ci" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                      <span className="text-zinc-400">Monto Exacto Bs (BCV):</span>
                      <span className="font-mono font-black text-amber-400 text-xs">
                        {dualPrice.ves}
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === "zelle" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Correo Zelle:</span>
                      <span className="font-mono font-bold text-white flex items-center gap-1">
                        {PAYMENT_ACCOUNTS.zelle.correo}
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(PAYMENT_ACCOUNTS.zelle.correo, "zelle_mail")
                          }
                          className="p-1 hover:text-orange-400"
                        >
                          {copiedField === "zelle_mail" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Titular:</span>
                      <span className="font-bold text-zinc-300">
                        {PAYMENT_ACCOUNTS.zelle.titular}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                      <span className="text-zinc-400">Monto USD:</span>
                      <span className="font-mono font-black text-emerald-400 text-xs">
                        {dualPrice.usd}
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === "binance" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Binance Pay ID:</span>
                      <span className="font-mono font-bold text-white flex items-center gap-1">
                        {PAYMENT_ACCOUNTS.binance.payId}
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(PAYMENT_ACCOUNTS.binance.payId, "bin_id")
                          }
                          className="p-1 hover:text-orange-400"
                        >
                          {copiedField === "bin_id" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Moneda:</span>
                      <span className="font-bold text-amber-400">
                        {PAYMENT_ACCOUNTS.binance.red}
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === "efectivo" && (
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    💵 {PAYMENT_ACCOUNTS.efectivo.instrucciones}
                  </p>
                )}
              </div>

              {/* Input de Referencia Bancaria */}
              {paymentMethod !== "efectivo" && (
                <div className="grid sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      N° de Referencia / Comprobante:
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Ej. 849201 ó 4 últimos dígitos"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {paymentMethod === "pago_movil" && (
                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                        Banco Emisor:
                      </label>
                      <select
                        value={paymentBank}
                        onChange={(e) => setPaymentBank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Banesco">Banesco</option>
                        <option value="Mercantil">Mercantil</option>
                        <option value="Banco de Venezuela">Banco de Venezuela</option>
                        <option value="BNC">BNC</option>
                        <option value="Bancaribe">Bancaribe</option>
                        <option value="Otro">Otro Banco</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Zona de Subida de Captura / Comprobante */}
              {paymentMethod !== "efectivo" && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-orange-400" />
                      Captura del Comprobante (Recomendado):
                    </span>
                    <span className="text-[10px] text-zinc-500 font-normal">JPG o PNG (máx 5MB)</span>
                  </label>

                  {proofUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-black/80 p-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={proofUrl}
                          alt="Comprobante"
                          className="w-12 h-12 object-cover rounded-xl border border-emerald-500/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-black text-emerald-400 block truncate">
                            ✓ Captura Adjunta con Éxito
                          </span>
                          <span className="text-[10px] text-zinc-400 block">
                            Lista para verificación de gerencia
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setProofUrl(null)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-all shrink-0"
                        title="Eliminar captura"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-orange-500/70 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white">
                        <Upload className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">
                          {isReadingFile ? "Cargando archivo..." : "Toca aquí para adjuntar la captura del pago"}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-0.5">
                        Agiliza la aprobación y activación inmediata de tu QR
                      </span>
                    </label>
                  )}
                </div>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {errorMsg}
              </p>
            )}

            {/* Resumen de Pago y Botón */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-black font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.97] transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5 text-black" />
                {isSubmitting ? "REPORTANDO PAGO..." : "REPORTAR PAGO & OBTENER PASE QR"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Conciliación automática y aprobación por la gerencia de The Corner</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
