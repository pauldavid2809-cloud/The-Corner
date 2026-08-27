import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Corner — Drinks, Board Games & Entertainment",
    short_name: "The Corner",
    description:
      "WebApp Oficial de The Corner: Catálogo de 50+ juegos de mesa, carta de pociones con luz UV y reservas con código QR.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090D",
    theme_color: "#F97316",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
