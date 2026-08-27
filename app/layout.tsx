import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";

export const viewport: Viewport = {
  themeColor: "#09090D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Juegos de Mesa, Tragos Mágicos & Lounge`,
  description: SITE_CONFIG.description,
  keywords: [
    "The Corner Maracaibo",
    "Juegos de mesa Maracaibo",
    "Bar gamer Maracaibo",
    "Pociones mágicas",
    "Ludoteca Maracaibo",
    "Stand up comedy Maracaibo",
    "Eventos privados Maracaibo",
    "Calle 72",
  ],
  authors: [{ name: "The Corner" }, { name: "ByteBridge" }],
  creator: "ByteBridge",
  openGraph: {
    title: `${SITE_CONFIG.name} | WebApp Oficial & Reservas`,
    description: SITE_CONFIG.tagline,
    url: "https://thecorner-mcbo.vercel.app",
    siteName: SITE_CONFIG.name,
    locale: "es_VE",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "The Corner — Bar de Juegos de Mesa y Pociones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090D] text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
