"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Logo } from "@/components/Logo";
import { Printer, Download, Sparkles, QrCode, ExternalLink } from "lucide-react";

type TableQR = {
  id: string;
  name: string;
  url: string;
};

export function TableQrGenerator() {
  const [selectedTable, setSelectedTable] = useState<string>("1");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tables: TableQR[] = [
    { id: "1", name: "Mesa 1", url: "https://the-corner-webapp.vercel.app/mesa/1" },
    { id: "2", name: "Mesa 2", url: "https://the-corner-webapp.vercel.app/mesa/2" },
    { id: "3", name: "Mesa 3", url: "https://the-corner-webapp.vercel.app/mesa/3" },
    { id: "4", name: "Mesa 4", url: "https://the-corner-webapp.vercel.app/mesa/4" },
    { id: "5", name: "Mesa 5", url: "https://the-corner-webapp.vercel.app/mesa/5" },
    { id: "6", name: "Mesa 6", url: "https://the-corner-webapp.vercel.app/mesa/6" },
    { id: "7", name: "Mesa 7", url: "https://the-corner-webapp.vercel.app/mesa/7" },
    { id: "8", name: "Mesa 8", url: "https://the-corner-webapp.vercel.app/mesa/8" },
    { id: "9", name: "Mesa 9", url: "https://the-corner-webapp.vercel.app/mesa/9" },
    { id: "10", name: "Mesa 10", url: "https://the-corner-webapp.vercel.app/mesa/10" },
    { id: "vip", name: "Zona VIP", url: "https://the-corner-webapp.vercel.app/mesa/vip" },
    { id: "barra", name: "Barra Principal", url: "https://the-corner-webapp.vercel.app/mesa/barra" },
  ];

  const currentTable = tables.find((t) => t.id === selectedTable) || tables[0];

  useEffect(() => {
    if (canvasRef.current) {
      const realUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/mesa/${currentTable.id}`
          : currentTable.url;

      QRCode.toCanvas(
        canvasRef.current,
        realUrl,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [currentTable]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
            <QrCode className="w-5 h-5 text-orange-400" />
            Generador de Stickers QR de Mesas
          </h2>
          <p className="text-xs text-zinc-400">
            Descarga o imprime los stickers de código QR listos para colocar en las mesas o acrílicos de The Corner.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Sticker</span>
        </button>
      </div>

      {/* Selector de Mesa */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTable(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase shrink-0 transition-all ${
              selectedTable === t.id
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Preview del Sticker Físico */}
      <div className="max-w-xs mx-auto p-6 rounded-3xl bg-black border-2 border-orange-500/50 shadow-2xl text-center space-y-4 print:border-black print:bg-white print:text-black">
        <div className="space-y-1">
          <Logo size="sm" withText />
          <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest pt-1">
            DRINKS & ENTERTAINMENT
          </p>
        </div>

        <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-2xl shadow-md">
          <span className="text-[10px] uppercase font-bold block opacity-80">
            Escanea para pedir
          </span>
          <h3 className="font-black text-xl uppercase tracking-tight">
            {currentTable.name}
          </h3>
        </div>

        {/* QR Canvas */}
        <div className="p-3 bg-white rounded-2xl inline-block shadow-inner">
          <canvas ref={canvasRef} />
        </div>

        <div className="text-left space-y-1 text-[11px] text-zinc-400 bg-zinc-900/90 p-3 rounded-xl border border-white/5">
          <p className="flex items-center gap-1.5 text-zinc-200 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Pide baldes, narguiles y comida</span>
          </p>
          <p className="flex items-center gap-1.5 text-zinc-200 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Llama al mesonero o pide juegos</span>
          </p>
        </div>

        <a
          href={`/mesa/${currentTable.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:underline font-bold print:hidden"
        >
          <span>Probar enlace de mesa</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
