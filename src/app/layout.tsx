import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mariscos El Jona | Pescados y Mariscos Frescos en Sinaloa",
  description:
    "Distribuidora de pescados y mariscos frescos en Mazatlán, Sinaloa. Mayoreo y menudeo con entrega a domicilio. Pulpo, camarón, calamar, callo de hacha, almejas, ostiones y más.",
  keywords: [
    "mariscos",
    "pescados frescos",
    "mayoreo mariscos",
    "menudeo mariscos",
    "Mazatlán",
    "Sinaloa",
    "pulpo",
    "camarón",
    "callo de hacha",
    "ostiones",
    "Mariscos El Jona",
  ],
  authors: [{ name: "Mariscos El Jona" }],
  icons: {
    icon: "/jona-logo.svg",
  },
  openGraph: {
    title: "Mariscos El Jona | Pescados y Mariscos Frescos",
    description:
      "Del Pacífico a tu mesa. Mayoreo y menudeo de mariscos frescos con entrega a domicilio.",
    siteName: "Mariscos El Jona",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
