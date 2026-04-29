import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Methodix — Soutien scolaire en ligne au Maroc",
  description:
    "Cours du programme marocain et correcteur d'exercices par intelligence artificielle. Tronc commun au bac.",
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
