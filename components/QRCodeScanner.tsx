"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  CameraOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  Keyboard,
  PartyPopper,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { LiveBooking } from "@/data/cornerData";

export type ScanVerificationResult = {
  success: boolean;
  status: "approved" | "already_redeemed" | "payment_pending" | "not_found";
  message: string;
  booking?: LiveBooking;
};

type QRCodeScannerProps = {
  onScanSuccess: (code: string) => Promise<ScanVerificationResult>;
  onStatsUpdate?: () => void;
};

export function QRCodeScanner({ onScanSuccess, onStatsUpdate }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ScanVerificationResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrRegionId = "corner-qr-reader";

  // Síntesis de Audio (Web Audio API)
  const playBeep = (isSuccess: boolean) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isSuccess) {
        // Tono agudo alegre (800Hz -> 1200Hz)
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else {
        // Zumbido de alerta grave (sawtooth 300Hz -> 200Hz)
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.setValueAtTime(200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  const handleProcessCode = async (rawCode: string) => {
    if (processing) return;
    setProcessing(true);

    let cleanCode = rawCode.trim();
    // Si viene como JSON del pase, parsearlo
    if (cleanCode.startsWith("{") && cleanCode.endsWith("}")) {
      try {
        const parsed = JSON.parse(cleanCode);
        if (parsed.ticket) cleanCode = parsed.ticket;
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const result = await onScanSuccess(cleanCode);
      setLastResult(result);
      playBeep(result.success);
      if (onStatsUpdate) onStatsUpdate();
    } catch (err) {
      console.error("Scan error:", err);
      setLastResult({
        success: false,
        status: "not_found",
        message: "Error al conectar con la base de datos de reservas.",
      });
      playBeep(false);
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 1800); // 1.8s cooldown
    }
  };

  const startScanner = async () => {
    setCameraError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrRegionId);
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleProcessCode(decodedText);
        },
        () => {
          // ignore scan frame errors
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        "No se pudo acceder a la cámara. Por favor autoriza los permisos del navegador o usa el ingreso manual de código."
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessCode(manualCode.trim());
    setManualCode("");
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-5 text-white">
      {/* Controles Superiores: Sonido y Modo Manual */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            soundEnabled
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? "Sonido Activado" : "Silenciado"}</span>
        </button>

        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs font-bold transition-all"
        >
          <Keyboard className="w-4 h-4" />
          <span>{showManualInput ? "Ver Cámara" : "Ingreso Manual"}</span>
        </button>
      </div>

      {/* Ingreso Manual si se activa */}
      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="p-4 rounded-2xl bg-zinc-900 border border-orange-500/40 space-y-3">
          <label className="block text-xs font-black uppercase text-zinc-300">
            Ingresa el Código del Pase (#CRN-XXXX):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="CRN-801"
              className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-zinc-700 font-mono text-sm uppercase text-white focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase"
            >
              {processing ? "..." : "Validar"}
            </button>
          </div>
        </form>
      )}

      {/* Visor de Cámara en Vivo */}
      <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-orange-500/40 shadow-2xl min-h-[320px] flex items-center justify-center">
        <div id={qrRegionId} className="w-full h-full min-h-[300px]" />

        {/* Marco y Mira Láser estilo The Corner */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-64 h-64 border-2 border-dashed border-orange-500/70 rounded-3xl relative animate-pulse shadow-lg">
              {/* Línea Láser animada */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent top-1/2 -translate-y-1/2 animate-bounce" />
            </div>
            <span className="mt-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-black uppercase text-orange-400 border border-orange-500/30">
              Apunta el Código QR del Cliente
            </span>
          </div>
        )}

        {/* Error de cámara */}
        {cameraError && (
          <div className="p-6 text-center space-y-3 max-w-sm">
            <CameraOff className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-300 font-bold">{cameraError}</p>
            <button
              onClick={startScanner}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar Cámara</span>
            </button>
          </div>
        )}
      </div>

      {/* Tarjeta de Resultado de Validación en Vivo */}
      {lastResult && (
        <div
          className={`p-5 rounded-3xl border shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
            lastResult.status === "approved"
              ? "bg-emerald-950/90 border-emerald-500 text-white"
              : lastResult.status === "already_redeemed"
              ? "bg-sky-950/90 border-sky-500 text-white"
              : lastResult.status === "payment_pending"
              ? "bg-amber-950/90 border-amber-500 text-white"
              : "bg-rose-950/90 border-rose-500 text-white"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 shrink-0">
              {lastResult.status === "approved" && (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              )}
              {lastResult.status === "already_redeemed" && (
                <AlertTriangle className="w-8 h-8 text-sky-400" />
              )}
              {lastResult.status === "payment_pending" && (
                <Clock className="w-8 h-8 text-amber-400" />
              )}
              {lastResult.status === "not_found" && (
                <XCircle className="w-8 h-8 text-rose-400" />
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                {lastResult.status === "approved"
                  ? "✅ ACCESO AUTORIZADO"
                  : lastResult.status === "already_redeemed"
                  ? "ℹ️ PASE YA CANJEADO"
                  : lastResult.status === "payment_pending"
                  ? "🟡 PAGO PENDIENTE DE APROBACIÓN"
                  : "❌ ENTRADA NO VÁLIDA"}
              </span>

              <h3 className="font-black text-lg text-white leading-tight">
                {lastResult.message}
              </h3>

              {lastResult.booking && (
                <div className="mt-3 p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1 text-xs">
                  <p>
                    <strong className="text-orange-400">Titular:</strong> {lastResult.booking.clientName}
                  </p>
                  <p>
                    <strong className="text-zinc-400">Paquete:</strong> {lastResult.booking.planName}
                  </p>
                  <p>
                    <strong className="text-zinc-400">Mesa:</strong>{" "}
                    <span className="font-bold text-white">
                      {lastResult.booking.tableNumber || "Por Asignar"}
                    </span>{" "}
                    ({lastResult.booking.pax} pax)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
