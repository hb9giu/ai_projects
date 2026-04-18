import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lajos Nyerges — Supply Chain & Integrated Insights",
  description:
    "Global supply chain professional at Roche: demand planning, SAP APO, SC planning & ERP vision, integrated insights.",
  keywords: [
    "supply chain",
    "demand planning",
    "SAP APO",
    "Roche",
    "integrated insights",
    "ERP",
  ],
  openGraph: {
    title: "Lajos Nyerges — Supply Chain & Integrated Insights",
    description:
      "Demand planning, SAP APO, and ERP vision — from Mondelēz logistics to Roche integrated insights.",
    type: "website",
    locale: "en_CH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lajos Nyerges — Supply Chain & Integrated Insights",
    description:
      "Demand planning, SAP APO, and ERP vision at enterprise scale.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}