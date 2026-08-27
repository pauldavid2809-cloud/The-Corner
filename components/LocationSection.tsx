"use client";

import { SITE_CONFIG } from "@/lib/config";
import {
  MapPin,
  Clock,
  Phone,
  Instagram,
  Navigation,
  Shield,
  Wifi,
  Sparkles,
  Car,
  ExternalLink,
} from "lucide-react";

export function LocationSection() {
  return (
    <section id="ubicacion" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#0B0B11] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            Ubicación & Contacto Directo
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ven a Visitar The Corner
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            En el corazón gastronómico y nocturno de Maracaibo. Fácil acceso, estacionamiento seguro y el mejor ambiente climatizado.
          </p>
        </div>

        {/* Tarjeta de Información y Mapa */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Columna Izquierda: Datos y Botones GPS */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Dirección */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Dirección
                  </h3>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {SITE_CONFIG.address}
                  </p>
                  <span className="text-xs text-orange-400 font-semibold block mt-1">
                    Sector Tierra Negra / Calle 72
                  </span>
                </div>
              </div>

              {/* Horarios */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Horario de Atención
                  </h3>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {SITE_CONFIG.hours}
                  </p>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">
                    🟢 Lunes y Martes cerrados por descanso del personal
                  </span>
                </div>
              </div>

              {/* Redes y Teléfono */}
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 hover:border-pink-500/40 hover:bg-zinc-800 transition-all flex items-center gap-3 group"
                >
                  <Instagram className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Instagram
                    </span>
                    <span className="text-xs font-black text-white truncate block">
                      {SITE_CONFIG.handle}
                    </span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 hover:border-emerald-500/40 hover:bg-zinc-800 transition-all flex items-center gap-3 group"
                >
                  <Phone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      WhatsApp Atención
                    </span>
                    <span className="text-xs font-black text-white truncate block">
                      {SITE_CONFIG.phoneFormatted}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Botones de Navegación GPS */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <a
                href={SITE_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <Navigation className="w-4 h-4" />
                ABRIR EN GOOGLE MAPS
              </a>

              <a
                href={SITE_CONFIG.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" />
                ABRIR EN WAZE
              </a>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Visual de Servicios & Ambientación */}
          <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-orange-500/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
            {/* Glow de fondo */}
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Experiencia Gamer & Lounge
              </span>
              <h3 className="text-2xl font-black text-white">
                Comodidades e Instalaciones en The Corner
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Diseñado para que juegues cómodo durante horas mientras disfrutas de nuestra gastronomía de autor y coctelería temática.
              </p>
            </div>

            {/* Checklist de Comodidades */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-orange-400 shrink-0">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Wi-Fi de Alta Velocidad
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Fibra óptica continua
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-amber-400 shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Estacionamiento Privado
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Vigilancia y Valet Parking
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-sky-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Seguridad 24/7
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Circuito cerrado y control
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-purple-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Iluminación UV Temática
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Ambiente fluorescente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
