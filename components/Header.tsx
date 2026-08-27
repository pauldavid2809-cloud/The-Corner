"use client";

import { useState, useEffect } from "react";
import { CurrencyMode } from "@/data/currencies";
import { SITE_CONFIG } from "@/lib/config";
import {
  Gamepad2,
  Sparkles,
  ShoppingBag,
  Calendar,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  Dices,
} from "lucide-react";

type Props = {
  currency: CurrencyMode;
  onToggleCurrency: () => void;
  bcvRate: number;
  cartCount: number;
  onOpenCart: () => void;
  isManagerMode: boolean;
  onToggleManagerMode: () => void;
  onOpenDiceRoller: () => void;
};

export function Header({
  currency,
  onToggleCurrency,
  bcvRate,
  cartCount,
  onOpenCart,
  isManagerMode,
  onToggleManagerMode,
  onOpenDiceRoller,
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Ludoteca 50+", href: "#ludoteca", icon: Gamepad2 },
    { label: "Pociones & Menú", href: "#menu", icon: Sparkles },
    { label: "Reservar Mesa", href: "#reservas", icon: Calendar },
    { label: "Eventos & Torneos", href: "#eventos", icon: Dices },
    { label: "Ubicación", href: "#ubicacion", icon: MapPin },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#09090D]/90 backdrop-blur-md border-b border-orange-500/20 shadow-lg shadow-black/40 py-2.5"
          : "bg-gradient-to-b from-[#09090D] via-[#09090D]/80 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo & Brand */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white uppercase group-hover:text-orange-400 transition-colors">
                The Corner
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-400">
                MCBO
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Drinks · Board Games & Lounge
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-orange-400/80" />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions (Dice Roller, Currency, Cart, Manager Switch, Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón Tira el Dado */}
          <button
            onClick={onOpenDiceRoller}
            title="¿No sabes qué jugar? Tira el Dado D20"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all hover:scale-105"
          >
            <Dices className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="hidden md:inline">Tirar D20</span>
          </button>

          {/* Switch Moneda USD / VES */}
          <button
            onClick={onToggleCurrency}
            title={`Cambiar a ${currency === "USD" ? "Bolívares (VES)" : "Dólares (USD)"}`}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-700 bg-zinc-900/80 hover:border-orange-500/50 hover:bg-zinc-800 transition-all text-zinc-200"
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                currency === "USD"
                  ? "bg-emerald-500 text-black font-extrabold"
                  : "text-zinc-400"
              }`}
            >
              $ USD
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                currency === "VES"
                  ? "bg-amber-500 text-black font-extrabold"
                  : "text-zinc-400"
              }`}
            >
              Bs. VES
            </span>
          </button>

          {/* Botón de Comanda / Carrito */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105 focus:outline-none"
            aria-label="Abrir comanda de pedidos"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-orange-600 text-[10px] font-black flex items-center justify-center border-2 border-black shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Switch Modo Gerente / Admin */}
          <button
            onClick={onToggleManagerMode}
            title={isManagerMode ? "Volver a vista Cliente" : "Modo Gerente / Dashboard"}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              isManagerMode
                ? "bg-red-500/20 border-red-500 text-red-300 hover:bg-red-500/30"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isManagerMode ? "Vista Cliente" : "Gerente"}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 px-4 py-3 bg-[#0e0e14] border-b border-orange-500/20 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg"
              >
                <Icon className="w-4 h-4 text-orange-400" />
                {link.label}
              </a>
            );
          })}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenDiceRoller();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg"
            >
              <Dices className="w-4 h-4" />
              Tirar Dado D20
            </button>
            <button
              onClick={() => {
                onToggleManagerMode();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              {isManagerMode ? "Modo Cliente" : "Modo Gerente"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
