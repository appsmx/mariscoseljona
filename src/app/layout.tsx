import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import FaqSchema from "@/components/seo/FaqSchema";

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
  title: "Mariscos El Jona | Pescados y Mariscos Frescos en Baja California",
  description:
    "Distribuidora de pescados y mariscos frescos en Rosarito, Baja California. Mayoreo y menudeo con entrega a domicilio. Pulpo, camarón, calamar, callo de hacha, almejas, ostiones y más.",
  keywords: [
    "mariscos",
    "pescados frescos",
    "mayoreo mariscos",
    "menudeo mariscos",
    "Rosarito",
    "Baja California",
    "Tijuana",
    "Ensenada",
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
    title: "Mariscos El Jona | Pescados y Mariscos Frescos en Baja California",
    description:
      "Del Pacífico a tu mesa. Distribuidora de mariscos frescos en Rosarito, BC. Mayoreo y menudeo con entrega a domicilio.",
    siteName: "Mariscos El Jona",
    locale: "es_MX",
    type: "website",
    url: "https://mariscoseljona.mx",
    images: [
      {
        url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/198b130d5c30.jpg",
        width: 1200,
        height: 630,
        alt: "Mariscos El Jona — Distribuidora de mariscos frescos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mariscos El Jona | Pescados y Mariscos Frescos",
    description:
      "Del Pacífico a tu mesa. Mayoreo y menudeo de mariscos frescos en Rosarito, Baja California.",
    images: ["https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/198b130d5c30.jpg"],
  },
  manifest: "/manifest.json",
  category: "food",
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <OrganizationSchema />
        <FaqSchema />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
