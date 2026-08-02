"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { siteConfig as fallbackConfig } from "@/lib/site-data";
import { useSiteConfig } from "@/hooks/use-site-config";
import { LoganSeal } from "@/components/site/LoganSeal";

const navColumns = [
  {
    title: "Productos",
    links: [
      { label: "Camarón", href: "#productos" },
      { label: "Pulpo", href: "#productos" },
      { label: "Callo de hacha", href: "#productos" },
      { label: "Ostiones", href: "#productos" },
      { label: "Pescados frescos", href: "#productos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "#nosotros" },
      { label: "Mayoreo & Menudeo", href: "#mayoreo-menudeo" },
      { label: "Cobertura", href: "#cobertura" },
      { label: "Ecosistema El Jona", href: "#ecosistema" },
      { label: "Ubicación", href: "#ubicacion" },
    ],
  },
];

export function Footer() {
  const { data: siteConfig } = useSiteConfig();
  if (!siteConfig) return null;
  const waLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    siteConfig.contact.whatsappMessage
  )}`;
  const { contact, social } = siteConfig;

  return (
    <footer className="bg-ocean-950 text-white">
      {/* CTA superior */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                ¿Listo para llevar el mar a tu cocina?
              </h3>
              <p className="mt-2 text-white/70">
                Cotizá en segundos. Respuesta directa del equipo, sin esperas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-brand-500 hover:bg-amber-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-brand-900/30 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                Llamar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 ring-1 ring-white/20">
                <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
                  <path
                    d="M14 36c0-7 6-13 13-13 4 0 8 2 10 5 1-4 5-7 9-7 1 0 2 0 3 1-3 1-5 4-5 7 0 0 4-2 7-1-2 4-6 6-10 6-2 0-3 0-4-1-1 4-5 7-9 7-7 0-14-1-14-4z"
                    fill="#fef3c7"
                  />
                  <circle cx="22" cy="32" r="1.6" fill="#0d9488" />
                </svg>
              </span>
              <div>
                <p className="font-display text-xl font-extrabold text-white">
                  Mariscos El Jona
                </p>
                <p className="text-xs text-amber-brand-200 uppercase tracking-[0.18em]">
                  Del Pacífico a tu mesa
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-md">
              Distribuidora de pescados y mariscos frescos con más de 17 años abasteciendo
              a restaurantes, pescaderías y hogares de Sinaloa. Frescura, trazabilidad y
              precio justo en cada entrega.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-amber-brand-300" />
                {contact.phoneDisplay}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors break-all">
                <Mail className="h-4 w-4 text-amber-brand-300 shrink-0" />
                {contact.email}
              </a>
              <p className="flex items-start gap-3 text-white/80">
                <MapPin className="h-4 w-4 text-amber-brand-300 shrink-0 mt-0.5" />
                <span>
                  {contact.address.street}
                  <br />
                  {contact.address.city}, {contact.address.state}
                </span>
              </p>
            </div>
          </div>

          {/* Columnas de navegación */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 hover:text-amber-brand-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Redes */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Síguenos
            </h4>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm text-white/65 hover:text-white transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Facebook className="h-4 w-4" />
                </span>
                Facebook
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm text-white/65 hover:text-white transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Instagram className="h-4 w-4" />
                </span>
                Instagram
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm text-white/65 hover:text-white transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} Mariscos El Jona. Todos los derechos reservados.
          </p>

          {/* Sello Logan */}
          <LoganSeal variant="dark" />

          <div className="flex items-center gap-4">
            <span>Mazatlán, Sinaloa · México</span>
            <span className="hidden sm:inline">·</span>
            <span>Hecho con orgullo sinaloense</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
