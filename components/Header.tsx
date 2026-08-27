"use client";

import { useState, useEffect } from "react";
import { CurrencyMode } from "@/data/currencies";
import { Logo } from "@/components/Logo";
import {
  PartyPopper,
  ShoppingBag,
  Calendar,
  MapPin,
  Menu,
  X,
  Flame,
  Gamepad2,
  TrendingUp,
} from "lucide-react";

type Props = {
  currency: CurrencyMode;
  onSelectCurrency: (mode: CurrencyMode) => void;
  bcvRate: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenDiceRoller: () => void;
};

export function Header({
  currency,
  onSelectCurrency,
  bcvRate,
  cartCount,
  onOpenCart,
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Paquetes Celebración", href: "#paquetes", icon: PartyPopper },
    { label: "Promos & Menú", href: "#menu", icon: Flame },
    { label: "Mario Kart & Juegos", href: "#juegos", icon: Gamepad2 },
    { label: "Cronograma Semanal", href: "#eventos", icon: Calendar },
    { label: "Ubicación", href: "#ubicacion", icon: MapPin },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-[#09090E]/95 backdrop-blur-md border-b border-orange-500/20 shadow-xl shadow-black/60 py-2.5"
          : "bg-gradient-to-b from-[#09090E] via-[#09090E]/80 to-transparent py-3 sm:py-4"
      }`}
    >
      {/* Ticker Superior con Tasa BCV Oficial */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-1.5 hidden sm:flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-orange-400">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Tasa Oficial BCV:
          </span>
          <span className="bg-zinc-900/90 px-2 py-0.5 rounded-md border border-zinc-800 font-mono text-zinc-200">
            💵 1$ = <strong className="text-emerald-400">{bcvRate.toFixed(2)}</strong> Bs.
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <span>📍 Maracaibo</span>
          <span>·</span>
          <span>Mié a Dom: 6:00 PM a 3:00 AM</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo Oficial The Corner */}
        <a
          href="#"
          className="group focus:outline-none rounded-2xl p-0.5"
        >
          <Logo withText size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-orange-400/90" />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions (Currency Selector $ USD / Bs. VES, Cart, Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de Moneda: Solo USD ($) y VES (Bs.) */}
          <div className="flex items-center p-0.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-xs font-bold">
            <button
              onClick={() => onSelectCurrency("USD")}
              title="Ver precios en Dólares ($)"
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                currency === "USD"
                  ? "bg-emerald-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => onSelectCurrency("VES")}
              title={`Ver precios en Bolívares (a tasa BCV ${bcvRate.toFixed(2)} Bs.)`}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                currency === "VES"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Bs. VES
            </button>
          </div>

          {/* Botón de Comanda / Carrito */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black shadow-lg shadow-orange-500/25 transition-transform active:scale-90"
            aria-label="Abrir comanda de pedidos"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-orange-600 text-[10px] font-black flex items-center justify-center border-2 border-black shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white active:scale-90 transition-transform"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Animado con Glassmorphism) */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 bg-black/95 backdrop-blur-2xl border-b border-orange-500/30 space-y-3 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          {/* Mobile Rate Ticker */}
          <div className="p-3 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Tasa Oficial BCV:
            </span>
            <span className="font-mono text-emerald-400 font-black text-sm">1$ = {bcvRate.toFixed(2)} Bs.</span>
          </div>

          <div className="space-y-1 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-black text-zinc-200 hover:text-orange-400 hover:bg-orange-500/10 active:bg-orange-500/20 active:scale-[0.98] rounded-2xl transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
