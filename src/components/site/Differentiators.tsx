"use client";

import { Waves, ShieldCheck, Truck, Handshake } from "lucide-react";
import { differentiators } from "@/lib/site-data";

const iconMap = {
  Waves,
  ShieldCheck,
  Truck,
  Handshake,
};

export function Differentiators() {
  return (
    <section className="relative py-16 sm:py-20 bg-ocean-950 text-white overflow-hidden">
      {/* Decoración */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-ocean-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-brand-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {differentiators.map((d) => {
            const Icon = iconMap[d.icon as keyof typeof iconMap];
            return (
              <div
                key={d.title}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-brand-400 to-amber-brand-600 shadow-lg shadow-amber-brand-900/30 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {d.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
