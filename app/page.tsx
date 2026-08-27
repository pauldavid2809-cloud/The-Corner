"use client";

import { useState, useEffect } from "react";
import {
  CurrencyMode,
  DEFAULT_BCV_RATE,
  DEFAULT_EUR_BCV_RATE,
} from "@/data/currencies";
import { BoardGame, MenuItem, WeeklyEvent } from "@/data/cornerData";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LudotecaSection } from "@/components/LudotecaSection";
import { DiceRollerModal } from "@/components/DiceRollerModal";
import { GameDetailModal } from "@/components/GameDetailModal";
import { MenuSection } from "@/components/MenuSection";
import { BookingSection, BookingData } from "@/components/BookingSection";
import { QrTicketModal } from "@/components/QrTicketModal";
import { CartDrawer, CartItem } from "@/components/CartDrawer";
import { EventsSection } from "@/components/EventsSection";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import {
  saveBookingToSupabase,
  fetchBcvRateFromSupabase,
  fetchLiveExchangeRates,
} from "@/lib/services";

export default function HomePage() {
  const [currency, setCurrency] = useState<CurrencyMode>("USD");
  const [usdRate, setUsdRate] = useState<number>(DEFAULT_BCV_RATE);
  const [eurRate, setEurRate] = useState<number>(DEFAULT_EUR_BCV_RATE);

  // Carrito / Comanda
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modales
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<BoardGame | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState<boolean>(false);
  const [activeBooking, setActiveBooking] = useState<BookingData | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);

  // Carga inicial de Tasas BCV en Vivo (Dólar & Euro)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Cargar carrito de localStorage
      try {
        const savedCart = localStorage.getItem("corner_cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error(e);
      }

      // Consultar API en vivo de Dólar y Euro BCV
      fetchLiveExchangeRates().then((rates) => {
        if (rates.usd) setUsdRate(rates.usd);
        if (rates.eur) setEurRate(rates.eur);
      });

      // Consultar también Supabase
      fetchBcvRateFromSupabase().then((rates) => {
        if (rates?.usd) setUsdRate(rates.usd);
        if (rates?.eur) setEurRate(rates.eur);
      });
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("corner_cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error(e);
      }
    }
  }, [cartItems]);

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: newQuantity } : ci
        )
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectGame = (game: BoardGame) => {
    setSelectedGame(game);
    setIsGameDetailOpen(true);
  };

  const handleGenerateQrTicket = (bookingData: BookingData) => {
    const code = `CRN-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveBooking(bookingData);
    setIsTicketModalOpen(true);

    // Guardar en Supabase en tiempo real con datos de pago y tasa BCV
    saveBookingToSupabase({
      code,
      clientName: bookingData.name,
      clientPhone: bookingData.phone,
      planId: bookingData.plan.id,
      planName: bookingData.plan.name,
      date: bookingData.date,
      time: bookingData.time,
      pax: bookingData.pax,
      totalUSD: bookingData.totalUSD,
      totalVES: bookingData.totalUSD * usdRate,
      notes: bookingData.notes,
      paymentMethod: bookingData.paymentMethod,
      paymentReference: bookingData.paymentReference,
      paymentBank: bookingData.paymentBank,
      paymentStatus: bookingData.paymentStatus,
    });
  };

  const handleSelectEventToBook = (event: WeeklyEvent) => {
    const bookingElement = document.getElementById("paquetes");
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#09090E] text-slate-100 selection:bg-orange-500 selection:text-black">
      {/* Cabecera Principal (Cliente) */}
      <Header
        currency={currency}
        onSelectCurrency={(mode) => setCurrency(mode)}
        usdRate={usdRate}
        eurRate={eurRate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenDiceRoller={() => setIsDiceRollerOpen(true)}
      />

      {/* Vista Principal de Clientes */}
      <main>
        {/* 1. Hero Section con estética oficial de The Corner */}
        <Hero
          onScrollToPackages={() => scrollTo("paquetes")}
          onScrollToMenu={() => scrollTo("menu")}
          onScrollToGames={() => scrollTo("juegos")}
        />

        {/* 2. Paquetes de Celebración & Cumpleaños con Gestión de Pagos */}
        <BookingSection
          currency={currency}
          bcvRate={usdRate}
          onGenerateQrTicket={handleGenerateQrTicket}
        />

        {/* 3. Menú Oficial: Promos Baldes 10$, Narguiles, 2 Perros $5, 3 Burgers $15 */}
        <MenuSection
          currency={currency}
          bcvRate={usdRate}
          onAddToCart={handleAddToCart}
        />

        {/* 4. Entretenimiento: Mario Kart en Pantalla Gigante, Beerpong & Juegos */}
        <LudotecaSection
          onSelectGame={handleSelectGame}
          onOpenDiceRoller={() => setIsDiceRollerOpen(true)}
        />

        {/* 5. Cronograma Semanal & Noches Temáticas (Despecho, Happy Hour 2x1, Watch Parties) */}
        <EventsSection onSelectEventToBook={handleSelectEventToBook} />

        {/* 6. Ubicación: C.C. Costa Verde Planta Alta */}
        <LocationSection />

        {/* Footer Oficial */}
        <Footer />
      </main>

      {/* Modal Tirada de Dado D20 / Recomendador */}
      <DiceRollerModal
        isOpen={isDiceRollerOpen}
        onClose={() => setIsDiceRollerOpen(false)}
        onSelectGame={handleSelectGame}
      />

      {/* Modal Ficha Detallada del Juego */}
      <GameDetailModal
        game={selectedGame}
        isOpen={isGameDetailOpen}
        onClose={() => setIsGameDetailOpen(false)}
        onRequestAtTable={(game, tableNum) => {
          console.log(`Solicitud de ${game.name} para ${tableNum}`);
        }}
      />

      {/* Modal de Pase Digital VIP con QR */}
      <QrTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        booking={activeBooking}
        bcvRate={usdRate}
      />

      {/* Drawer de la Comanda Digital */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        bcvRate={usdRate}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
