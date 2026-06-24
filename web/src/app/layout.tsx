import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Correction d'exercices en ligne au Maroc | IA & Professeurs - Methodix",
  description:
    "Methodix aide les élèves à corriger leurs exercices en ligne avec l'IA et des professeurs. Quiz gratuits, corrections détaillées, préparation Bac et programme marocain.",
  icons: {
    icon: [{ url: "/methodix-logo.png", type: "image/png" }],
    apple: "/methodix-logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`h-full antialiased ${geistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="page-bg flex min-h-full flex-col font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
