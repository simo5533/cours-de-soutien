import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a6cff" },
    { media: "(prefers-color-scheme: dark)", color: "#061b4e" },
  ],
};

export const metadata: Metadata = {
  title: "Correction d'exercices en ligne au Maroc | IA & Professeurs - CorrecteurPlus",
  description:
    "CorrecteurPlus aide les élèves à corriger leurs exercices en ligne avec l'IA et des professeurs. Quiz gratuits, corrections détaillées, préparation Bac et programme marocain.",
  applicationName: "CorrecteurPlus",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CorrecteurPlus",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

function localeFromPathname(pathname: string): "fr" | "ar" {
  if (pathname.startsWith("/ar") || pathname === "/ar") return "ar";
  return "fr";
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const locale = localeFromPathname(pathname);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="h-full antialiased" suppressHydrationWarning>
      <body className="site-bg flex min-h-full flex-col font-sans text-foreground antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
