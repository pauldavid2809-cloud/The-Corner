"use client";

import { SITE_CONFIG } from "@/lib/config";
import { Gamepad2, Heart, ShieldCheck } from "lucide-react";

type Props = {
  onToggleManagerMode: () => void;
};

export function Footer({ onToggleManagerMode }: Props) {
  return (
    <footer className="border-t border-white/10 bg-[#07070a] py-12 px-4 sm:px-6 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-black">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-base font-black uppercase text-white tracking-tight">
                The Corner
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                MCBO
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-zinc-300">
            <a href="#ludoteca" className="hover:text-orange-400 transition-colors">
              Ludoteca 50+
            </a>
            <a href="#menu" className="hover:text-orange-400 transition-colors">
              Pociones & Menú
            </a>
            <a href="#reservas" className="hover:text-orange-400 transition-colors">
              Reservas con QR
            </a>
            <a href="#eventos" className="hover:text-orange-400 transition-colors">
              Agenda de Torneos
            </a>
            <a href="#ubicacion" className="hover:text-orange-400 transition-colors">
              Ubicación
            </a>
            <button
              onClick={onToggleManagerMode}
              className="text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Acceso Gerente
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-zinc-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name} · Todos los derechos reservados.
          </p>

          <p className="flex items-center justify-center gap-1">
            Diseñado e implementado con pasión gamer por{" "}
            <a
              href="https://wa.me/584120308674"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-400 hover:underline"
            >
              ByteBridge
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
