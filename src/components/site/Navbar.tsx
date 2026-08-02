"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/hooks/use-site-config";

const navLinks = [
  { href: "#productos", label: "Productos" },
  { href: "#mayoreo-menudeo", label: "Mayoreo & Menudeo" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#cobertura", label: "Cobertura" },
  { href: "#ecosistema", label: "Ecosistema" },
  { href: "#ubicacion", label: "Ubicación" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: siteConfig } = useSiteConfig();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!siteConfig) return null;

  const waLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    siteConfig.contact.whatsappMessage
  )}`;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center gap-3 group">
            <span className="relative inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 items-center justify-center shadow-md ring-1 ring-white/20">
              <svg viewBox="0 0 64 64" className="h-7 w-7 sm:h-8 sm:w-8" fill="none">
                <path
                  d="M14 36c0-7 6-13 13-13 4 0 8 2 10 5 1-4 5-7 9-7 1 0 2 0 3 1-3 1-5 4-5 7 0 0 4-2 7-1-2 4-6 6-10 6-2 0-3 0-4-1-1 4-5 7-9 7-7 0-14-1-14-4z"
                  fill="#fef3c7"
                />
                <circle cx="22" cy="32" r="1.6" fill="#0d9488" />
              </svg>
            </span>
            <div className="flex flex-col leading-none">
              <span
                className={cn(
                  "font-display text-lg sm:text-xl font-extrabold tracking-tight transition-colors",
                  scrolled ? "text-ocean-800" : "text-white drop-shadow-md"
                )}
              >
                Mariscos El Jona
              </span>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium tracking-[0.18em] uppercase transition-colors",
                  scrolled ? "text-amber-brand-700" : "text-amber-brand-200"
                )}
              >
                Del Pacífico a tu mesa
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  scrolled
                    ? "text-foreground/70 hover:text-ocean-700 hover:bg-ocean-50"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                scrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10"
              )}
            >
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phoneDisplay}
            </a>
            <Button asChild size="sm" className="bg-amber-brand-500 hover:bg-amber-brand-600 text-white shadow-md">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                Cotizar por WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
            )}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium rounded-lg text-foreground/80 hover:bg-ocean-50 hover:text-ocean-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="inline-flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium rounded-lg bg-muted text-foreground"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.contact.phoneDisplay}
              </a>
              <Button asChild className="bg-amber-brand-500 hover:bg-amber-brand-600 text-white">
                <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                  Cotizar por WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
