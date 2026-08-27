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
  usdRate: number;
  eurRate: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenDiceRoller: () => void;
};

export function Header({
  currency,
  onSelectCurrency,
  usdRate,
  eurRate,
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
      {/* Ticker Superior de Tasas BCV en Vivo (Dólar & Euro) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-1.5 hidden sm:flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-orange-400">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Tasas Oficiales BCV:
          </span>
          <span className="bg-zinc-900/90 px-2 py-0.5 rounded-md border border-zinc-800 font-mono text-zinc-200">
            💵 $1 = <strong className="text-emerald-400">{usdRate.toFixed(2)}</strong> Bs.
          </span>
          <span className="bg-zinc-900/90 px-2 py-0.5 rounded-md border border-zinc-800 font-mono text-zinc-200">
            💶 €1 = <strong className="text-sky-400">{eurRate.toFixed(2)}</strong> Bs.
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <span>📍 C.C. Costa Verde (Planta Alta)</span>
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

        {/* Actions (Triple Currency Selector, Cart, Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de Moneda: USD ($), EUR (€), VES (Bs.) */}
          <div className="flex items-center p-0.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-xs font-bold">
            <button
              onClick={() => onSelectCurrency("USD")}
              title={`Ver precios en Dólares ($)`}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                currency === "USD"
                  ? "bg-emerald-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => onSelectCurrency("EUR")}
              title={`Ver precios en Euros (€)`}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                currency === "EUR"
                  ? "bg-sky-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              € EUR
            </button>
            <button
              onClick={() => onSelectCurrency("VES")}
              title={`Ver precios en Bolívares (Bs.)`}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                currency === "VES"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Bs.
            </button>
          </div>

          {/* Botón de Comanda / Carrito */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
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
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 px-4 py-3 bg-[#0d0d14] border-b border-orange-500/20 space-y-2">
          {/* Mobile Rate Ticker */}
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400 text-[11px]">BCV Hoy:</span>
            <div className="flex gap-2">
              <span className="font-mono text-emerald-400 font-bold">$ {usdRate.toFixed(2)}</span>
              <span className="text-zinc-600">|</span>
              <span className="font-mono text-sky-400 font-bold">€ {eurRate.toFixed(2)}</span>
            </div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-zinc-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl"
              >
                <Icon className="w-4 h-4 text-orange-400" />
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
