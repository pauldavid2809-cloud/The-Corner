"use client";

import { useEffect, useState } from "react";
import { PartyPopper, Flame, Gamepad2, ShoppingBag, MapPin } from "lucide-react";

type Props = {
  cartCount: number;
  onOpenCart: () => void;
};

export function MobileBottomNav({ cartCount, onOpenCart }: Props) {
  const [activeSection, setActiveSection] = useState<string>("inicio");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["paquetes", "menu", "juegos", "eventos", "ubicacion"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("inicio");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto print:hidden pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-around p-1.5 rounded-full bg-black/85 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-black/90">
        {/* Paquetes / QR */}
        <button
          onClick={() => scrollToSection("paquetes")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-90 ${
            activeSection === "paquetes"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <PartyPopper className="w-4 h-4" />
          <span className="text-[9px] uppercase font-extrabold tracking-tight mt-0.5">
            Pase QR
          </span>
        </button>

        {/* Menú & Promos */}
        <button
          onClick={() => scrollToSection("menu")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-90 ${
            activeSection === "menu"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-[9px] uppercase font-extrabold tracking-tight mt-0.5">
            Menú
          </span>
        </button>

        {/* Mario Kart & Juegos */}
        <button
          onClick={() => scrollToSection("juegos")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-90 ${
            activeSection === "juegos"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="text-[9px] uppercase font-extrabold tracking-tight mt-0.5">
            Juegos
          </span>
        </button>

        {/* Comanda / Carrito */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full text-zinc-400 hover:text-white transition-all active:scale-90"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-orange-500 text-black text-[9px] font-black flex items-center justify-center border border-black shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase font-extrabold tracking-tight mt-0.5">
            Comanda
          </span>
        </button>

        {/* Ubicación */}
        <button
          onClick={() => scrollToSection("ubicacion")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all active:scale-90 ${
            activeSection === "ubicacion"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[9px] uppercase font-extrabold tracking-tight mt-0.5">
            Llegar
          </span>
        </button>
      </nav>
    </div>
  );
}
