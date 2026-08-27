"use client";

import { useState, useEffect } from "react";
import { CurrencyMode, DEFAULT_BCV_RATE } from "@/data/currencies";
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
import { ManagerDashboard } from "@/components/ManagerDashboard";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [currency, setCurrency] = useState<CurrencyMode>("USD");
  const [bcvRate, setBcvRate] = useState<number>(DEFAULT_BCV_RATE);
  const [isManagerMode, setIsManagerMode] = useState<boolean>(false);

  // Carrito / Comanda
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modales
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<BoardGame | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState<boolean>(false);
  const [activeBooking, setActiveBooking] = useState<BookingData | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);

  // Carga inicial y query params para modo admin (?gerente=true o ?admin=true)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true" || params.get("gerente") === "true") {
        setIsManagerMode(true);
      }

      // Cargar carrito previo de localStorage si existe
      try {
        const savedCart = localStorage.getItem("corner_cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error(e);
      }
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

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "VES" : "USD"));
  };

  const toggleManagerMode = () => {
    setIsManagerMode((prev) => !prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    setActiveBooking(bookingData);
    setIsTicketModalOpen(true);
  };

  const handleSelectEventToBook = (event: WeeklyEvent) => {
    const bookingElement = document.getElementById("reservas");
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
    <div className="min-h-screen bg-[#09090D] text-slate-100 selection:bg-orange-500 selection:text-black">
      {/* Cabecera Principal */}
      <Header
        currency={currency}
        onToggleCurrency={toggleCurrency}
        bcvRate={bcvRate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isManagerMode={isManagerMode}
        onToggleManagerMode={toggleManagerMode}
        onOpenDiceRoller={() => setIsDiceRollerOpen(true)}
      />

      {isManagerMode ? (
        /* Panel del Gerente */
        <ManagerDashboard
          onExitManagerMode={() => setIsManagerMode(false)}
          bcvRate={bcvRate}
          onUpdateBcvRate={(newRate) => setBcvRate(newRate)}
        />
      ) : (
        /* Vista Principal de Clientes */
        <main>
          {/* 1. Hero Section */}
          <Hero
            onScrollToLudoteca={() => scrollTo("ludoteca")}
            onScrollToMenu={() => scrollTo("menu")}
            onScrollToBooking={() => scrollTo("reservas")}
            onOpenDiceRoller={() => setIsDiceRollerOpen(true)}
          />

          {/* 2. Ludoteca Digital Interactiva (50+ Juegos de Mesa) */}
          <LudotecaSection
            onSelectGame={handleSelectGame}
            onOpenDiceRoller={() => setIsDiceRollerOpen(true)}
          />

          {/* 3. Carta & Mixología Temática (Menú de Pociones & Munchies) */}
          <MenuSection
            currency={currency}
            bcvRate={bcvRate}
            onAddToCart={handleAddToCart}
          />

          {/* 4. Módulo de Reservas & Pases VIP con QR */}
          <BookingSection
            currency={currency}
            bcvRate={bcvRate}
            onGenerateQrTicket={handleGenerateQrTicket}
          />

          {/* 5. Agenda de Eventos & Torneos Semanales */}
          <EventsSection onSelectEventToBook={handleSelectEventToBook} />

          {/* 6. Ubicación & Contacto */}
          <LocationSection />

          {/* Footer */}
          <Footer onToggleManagerMode={toggleManagerMode} />
        </main>
      )}

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
        bcvRate={bcvRate}
      />

      {/* Drawer de la Comanda Digital */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        bcvRate={bcvRate}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
