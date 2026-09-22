import type { MetadataRoute } from "next";

/**
 * Web App Manifest — permet d’installer CorrecteurPlus comme application mobile (PWA).
 * Servi automatiquement sur /manifest.webmanifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CorrecteurPlus",
    short_name: "CorrecteurPlus",
    description:
      "Corrige tes exercices avec l'IA — programme scolaire marocain, quiz et suivi de progression.",
    start_url: "/fr",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#edf6ff",
    theme_color: "#0a6cff",
    lang: "fr",
    dir: "ltr",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
