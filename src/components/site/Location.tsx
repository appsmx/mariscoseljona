"use client";

import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-data";

export function Location() {
  const waLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    siteConfig.contact.whatsappMessage
  )}`;
  const { contact } = siteConfig;
  const mapQuery = encodeURIComponent(
    `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.zip}, México`
  );

  return (
    <section id="ubicacion" className="relative py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          {/* Información de contacto */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-brand-50 border border-amber-brand-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-brand-700 w-fit">
              Visitanos o escribinos
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Estamos en Mazatlán, Sinaloa
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Pasá a comprar directo al mostrador, llamános por teléfono o escribinos por
              WhatsApp. La atención es personalizada y siempre vas a hablar con alguien del
              equipo, nunca con un menú automático.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 border-ocean-100">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-foreground">Dirección</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {contact.address.street}
                  <br />
                  {contact.address.city}, {contact.address.state}
                  <br />
                  C.P. {contact.address.zip}, {contact.address.country}
                </p>
                <a
                  href={`https://maps.google.com/?q=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-800"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Cómo llegar
                </a>
              </Card>

              <Card className="p-5 border-ocean-100">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-brand-100 text-amber-brand-700">
                    <Clock className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-foreground">Horarios</h3>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {contact.hours.map((h) => (
                    <li key={h.day} className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/80">{h.day}:</span>{" "}
                      {h.time}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-5 border-ocean-100">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700">
                    <Phone className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-foreground">Teléfono</h3>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="mt-3 block text-sm font-medium text-ocean-700 hover:text-ocean-800"
                >
                  {contact.phoneDisplay}
                </a>
              </Card>

              <Card className="p-5 border-ocean-100">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-brand-100 text-amber-brand-700">
                    <Mail className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-foreground">Correo</h3>
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-3 block text-sm font-medium text-ocean-700 hover:text-ocean-800 break-all"
                >
                  {contact.email}
                </a>
              </Card>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-amber-brand-500 hover:bg-amber-brand-600 text-white h-12 px-6">
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Escribir por WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 border-ocean-200 text-ocean-700 hover:bg-ocean-50">
                <a href={`tel:${contact.phone}`}>
                  <Phone className="h-5 w-5" />
                  Llamar ahora
                </a>
              </Button>
            </div>
          </div>

          {/* Mapa */}
          <div className="relative min-h-[400px] lg:min-h-full rounded-3xl overflow-hidden shadow-xl border border-border">
            <iframe
              title="Ubicación de Mariscos El Jona"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=-106.5%2C23.18%2C-106.35%2C23.28&layer=mapnik&marker=23.23%2C-106.42`}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg p-4 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-600 text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm leading-tight">
                  Mariscos El Jona — Mostrador & Distribuidora
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {contact.address.street}, {contact.address.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
