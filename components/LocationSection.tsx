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
  Tv,
} from "lucide-react";

export function LocationSection() {
  return (
    <section id="ubicacion" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-[#0B0B11] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            C.C. COSTA VERDE · PLANTA ALTA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Encuéntranos en Costa Verde
          </h2>
          <p className="text-sm sm:text-base text-zinc-300">
            En la planta alta del C.C. Costa Verde (Local PA-35-36). Fácil acceso, estacionamiento seguro con vigilancia y el mejor ambiente climatizado.
          </p>
        </div>

        {/* Tarjeta de Información y Mapa */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Columna Izquierda: Datos y Botones GPS */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Dirección */}
              <div className="p-5 rounded-3xl bg-zinc-900/80 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Dirección Oficial
                  </h3>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {SITE_CONFIG.address}
                  </p>
                  <span className="text-xs text-orange-400 font-semibold block mt-1">
                    Av. Bella Vista con Calle 67 (Planta Alta)
                  </span>
                </div>
              </div>

              {/* Horarios */}
              <div className="p-5 rounded-3xl bg-zinc-900/80 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Horario de Rumba & Atención
                  </h3>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {SITE_CONFIG.hours}
                  </p>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">
                    🟢 Abierto de Miércoles a Domingos
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
                      Instagram Oficial
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
                      WhatsApp Reservas
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
                className="py-3.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.97] transition-all"
              >
                <Navigation className="w-4 h-4" />
                ABRIR EN GOOGLE MAPS
              </a>

              <a
                href={SITE_CONFIG.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.97] transition-all"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" />
                ABRIR EN WAZE
              </a>
            </div>
          </div>

          {/* Columna Derecha: Instalaciones de The Corner en Costa Verde */}
          <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-orange-500/30 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Instalaciones de The Corner
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                Todo en un Solo Lugar en Costa Verde
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Pantalla gigante para Watch Parties y Mario Kart, karaoke profesional, mesas de beerpong, zona de narguiles y área climatizada para tus celebraciones.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-zinc-800 text-orange-400 shrink-0">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Pantallas Gigantes
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Watch Parties & Mario Kart
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-zinc-800 text-amber-400 shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Estacionamiento C.C.
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Costa Verde con Vigilancia
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-zinc-800 text-pink-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Narguiles & Hookah
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Carbón de coco continuo
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-zinc-800 text-purple-400 shrink-0">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Wi-Fi & Aire Acondicionado
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Ambiente full climatizado
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
