import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Correction d'exercices en ligne au Maroc | IA & Professeurs - CorrecteurPlus",
  description:
    "CorrecteurPlus aide les élèves à corriger leurs exercices en ligne avec l'IA et des professeurs. Quiz gratuits, corrections détaillées, préparation Bac et programme marocain.",
  icons: {
    icon: [{ url: "/brand/correcteurplus-logo.png", type: "image/png" }],
    apple: "/brand/correcteurplus-logo.png",
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
      </body>
    </html>
  );
}
