import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";

export const viewport: Viewport = {
  themeColor: "#09090E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://the-corner-webapp.vercel.app"
  ),
  title: `${SITE_CONFIG.officialTitle} — Maracaibo`,
  description: SITE_CONFIG.description,
  keywords: [
    "The Corner Maracaibo",
    "The Corner",
    "Narguiles Maracaibo",
    "Beerpong Maracaibo",
    "Mario Kart Maracaibo",
    "Juegos de mesa Maracaibo",
    "Paquetes de cumpleaños Maracaibo",
  ],
  authors: [{ name: "The Corner" }, { name: "ByteBridge" }],
  creator: "The Corner & ByteBridge",
  openGraph: {
    title: `${SITE_CONFIG.officialTitle} | Maracaibo`,
    description: SITE_CONFIG.tagline,
    url: "https://the-corner-webapp.vercel.app",
    siteName: SITE_CONFIG.name,
    locale: "es_VE",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "The Corner Drinks & Entertainment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090E] text-slate-100 antialiased selection:bg-orange-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
