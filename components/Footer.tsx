"use client";

import { SITE_CONFIG } from "@/lib/config";
import { Logo } from "@/components/Logo";
import {
  PartyPopper,
  Instagram,
  Phone,
  Heart,
  Flame,
  Gamepad2,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-white/10 text-zinc-400 text-xs py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/5">
        {/* Columna 1: Brand & Bio */}
        <div className="md:col-span-5 space-y-4">
          <Logo withText size="md" />

          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
            {SITE_CONFIG.description}
          </p>

          <div className="pt-1 flex items-center gap-3">
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-pink-600 hover:text-white text-zinc-300 border border-zinc-800 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <Instagram className="w-4 h-4" />
              <span>{SITE_CONFIG.handle}</span>
            </a>

            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-600 hover:text-white text-zinc-300 border border-zinc-800 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-black text-white text-xs uppercase tracking-wider">
            Secciones & Experiencias
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="#paquetes"
                className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
              >
                <PartyPopper className="w-3.5 h-3.5 text-orange-400" />
                Paquetes de Cumpleaños & Eventos ($50 - $150)
              </a>
            </li>
            <li>
              <a
                href="#menu"
                className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Promos de Baldes $10, Narguiles & Burgers
              </a>
            </li>
            <li>
              <a
                href="#juegos"
                className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                Mario Kart en Pantalla Gigante & Beerpong
              </a>
            </li>
            <li>
              <a
                href="#eventos"
                className="hover:text-orange-400 transition-colors"
              >
                Cronograma Semanal & Noches Temáticas
              </a>
            </li>
            <li>
              <a
                href="#ubicacion"
                className="hover:text-orange-400 transition-colors"
              >
                Ubicación C.C. Costa Verde (Planta Alta)
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Horarios & Ubicación */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-black text-white text-xs uppercase tracking-wider">
            Horarios de Atención
          </h4>
          <div className="space-y-1 text-xs text-zinc-400">
            <p className="font-bold text-white">Miércoles a Domingos</p>
            <p>06:00 PM - 03:00 AM</p>
            <p className="text-[11px] text-zinc-500 mt-2">
              {SITE_CONFIG.shortAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
        <p>© {new Date().getFullYear()} THE CORNER DRINKS & ENTERTAINMENT. C.C. Costa Verde, Maracaibo.</p>
        <p className="flex items-center gap-1">
          Desarrollado con <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> para Maracaibo
        </p>
      </div>
    </footer>
  );
}
