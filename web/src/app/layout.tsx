import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="h-full antialiased" suppressHydrationWarning>
      <body className="site-bg flex min-h-full flex-col font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
