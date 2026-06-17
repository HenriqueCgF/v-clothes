import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "V-Clothes — Roupas que realmente servem em você",
  description:
    "Tire uma foto e o V-Clothes mede seu corpo automaticamente para recomendar apenas roupas que vão servir perfeitamente. Tecnologia de visão computacional para moda.",
  keywords: [
    "moda online",
    "medição corporal",
    "recomendação de roupas",
    "tamanho certo",
    "compra de roupas online",
    "V-Clothes",
  ],
  openGraph: {
    title: "V-Clothes — Roupas que realmente servem em você",
    description:
      "Tecnologia de IA que mede seu corpo por foto e recomenda roupas no tamanho certo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
