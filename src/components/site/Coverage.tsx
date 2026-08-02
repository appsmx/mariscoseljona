"use client";

import { MapPin, Truck, Clock, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { coverage, siteConfig } from "@/lib/site-data";

export function Coverage() {
  return (
    <section id="cobertura" className="relative py-20 sm:py-28 bg-gradient-to-b from-background to-ocean-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Texto */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ocean-50 border border-ocean-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ocean-700">
              Zona de cobertura
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Llevamos frescura a toda la región
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {coverage.deliverySchedule} Trabajamos con vehículos refrigerados que mantienen
              la temperatura en todo el trayecto, garantizando que el producto llegue con la
              misma frescura con la que salió del mar.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-semibold text-foreground">Zona primaria (entrega misma dia)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {coverage.primary.join(" · ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-brand-100 text-amber-brand-700">
                  <Truck className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-semibold text-foreground">Zona extendida (24-48 h)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {coverage.extended.join(" · ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-semibold text-foreground">Horarios de entrega</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lunes a sábado · Pedidos antes de las 11:00 AM se entregan el mismo día.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa decorativo */}
          <div className="relative">
            <Card className="relative overflow-hidden border-ocean-200 shadow-xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-ocean-100 via-ocean-50 to-amber-brand-50 relative">
                {/* Mapa simplificado */}
                <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#mapGrad)" />
                  {/* Costa estilizada */}
                  <path
                    d="M0 180 Q80 160 140 175 T280 165 T400 180 L400 300 L0 300 Z"
                    fill="#0d9488"
                    opacity="0.2"
                  />
                  <path
                    d="M0 180 Q80 160 140 175 T280 165 T400 180"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  {/* Marcadores de ciudad */}
                  {[
                    { x: 80, y: 200, label: "Los Mochis" },
                    { x: 130, y: 210, label: "Guasave" },
                    { x: 200, y: 215, label: "Culiacán" },
                    { x: 280, y: 220, label: "Navolato" },
                    { x: 340, y: 230, label: "Mazatlán" },
                  ].map((c) => (
                    <g key={c.label}>
                      <circle cx={c.x} cy={c.y} r="6" fill="#d97706" />
                      <circle cx={c.x} cy={c.y} r="12" fill="#d97706" opacity="0.3" />
                      <text x={c.x} y={c.y - 12} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0f172a">
                        {c.label}
                      </text>
                    </g>
                  ))}
                  {/* Línea de conexión */}
                  <path
                    d="M80 200 L130 210 L200 215 L280 220 L340 230"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.7"
                  />
                </svg>

                {/* Badge flotante */}
                <div className="absolute top-4 left-4 rounded-lg bg-card/95 backdrop-blur-sm border border-border shadow-md px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-amber-brand-600" />
                    <span className="text-xs font-semibold text-foreground">
                      Cobertura Sinaloa
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-card">
                <p className="text-sm text-muted-foreground">
                  ¿Tu ciudad no está en la lista?{" "}
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-ocean-700 hover:text-ocean-800 underline underline-offset-2"
                  >
                    Consultanos
                  </a>
                  , hacemos envíos foráneos por paquetería refrigerada a todo México.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
