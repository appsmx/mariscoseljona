"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Snowflake, Sparkles, Clock, ChevronRight } from "lucide-react";
import { products, siteConfig, type Product } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  todos: "Todos",
  marisco: "Mariscos",
  pescado: "Pescados",
  especialidad: "Especialidades",
};

const tagConfig: Record<string, { label: string; className: string }> = {
  mayoreo: { label: "Mayoreo", className: "bg-ocean-100 text-ocean-700 border-ocean-200" },
  menudeo: { label: "Menudeo", className: "bg-amber-brand-100 text-amber-brand-700 border-amber-brand-200" },
  fresco: { label: "Fresco", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  congelado: { label: "Congelado", className: "bg-sky-100 text-sky-700 border-sky-200" },
  premium: { label: "Premium", className: "bg-rose-100 text-rose-700 border-rose-200" },
};

const availabilityConfig: Record<string, { icon: typeof Clock; label: string; color: string }> = {
  Diaria: { icon: Clock, label: "Disponible hoy", color: "text-emerald-600" },
  Temporada: { icon: Sparkles, label: "De temporada", color: "text-amber-600" },
  "Bajo pedido": { icon: Snowflake, label: "Bajo pedido", color: "text-sky-600" },
};

function ProductCard({ product }: { product: Product }) {
  const waLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    `Hola Mariscos El Jona, me interesa cotizar ${product.name}. ¿Me pueden dar precio y disponibilidad?`
  )}`;
  const avail = availabilityConfig[product.availability];
  const AvailIcon = avail.icon;

  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card hover:shadow-xl hover:shadow-ocean-900/10 transition-all duration-300 hover:-translate-y-1">
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ocean-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-transparent to-transparent" />

        {/* Disponibilidad */}
        <div className="absolute top-3 left-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-md">
            <AvailIcon className={cn("h-3.5 w-3.5", avail.color)} />
            <span className="text-foreground">{product.availability}</span>
          </div>
        </div>

        {/* Categoría */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-ocean-600/90 text-white border-0 backdrop-blur-sm capitalize text-[10px] uppercase tracking-wide">
            {product.category}
          </Badge>
        </div>

        {/* Nombre sobre imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-2xl font-bold text-white leading-tight drop-shadow-md">
            {product.name}
          </h3>
          {product.scientific && (
            <p className="text-xs text-white/80 italic mt-0.5">{product.scientific}</p>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {product.description}
        </p>

        {/* Presentaciones */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ocean-700 mb-2">
            Presentaciones
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.presentation.map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-md bg-ocean-50 px-2 py-0.5 text-xs font-medium text-ocean-700 border border-ocean-100"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.tags.map((t) => {
            const cfg = tagConfig[t];
            return (
              <Badge key={t} variant="outline" className={cn("text-[10px] font-semibold", cfg.className)}>
                {cfg.label}
              </Badge>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full bg-ocean-600 hover:bg-ocean-700 text-white group/btn">
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Cotizar este producto
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCatalog() {
  const [category, setCategory] = useState<string>("todos");

  const filtered =
    category === "todos"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <section id="productos" className="relative py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-ocean-50 border border-ocean-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ocean-700">
            Catálogo
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Nuestros productos del mar
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Cada producto se recibe en fresco del Pacífico mexicano y se clasifica bajo
            estándares de calidad HACCP. Tocá cualquier producto para cotizar por WhatsApp
            en segundos.
          </p>
        </div>

        {/* Filtros */}
        <div className="mt-8">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-muted/60 h-auto p-1 flex flex-wrap gap-1">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="data-[state=active]:bg-ocean-600 data-[state=active]:text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid de productos */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Aviso */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          ¿Buscás un producto que no está listado?{" "}
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ocean-700 hover:text-ocean-800 underline underline-offset-2"
          >
            Consultanos directamente
          </a>
          . Trabajamos con más de 40 especies de temporada.
        </p>
      </div>
    </section>
  );
}
