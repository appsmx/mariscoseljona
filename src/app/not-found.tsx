import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Fish, Home, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-950 px-4 py-12 relative overflow-hidden">
      {/* Decoración */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-ocean-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-amber-brand-500/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Logo */}
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 shadow-2xl ring-1 ring-white/20 mb-8 mx-auto">
          <Fish className="h-10 w-10 text-amber-brand-200" />
        </span>

        <h1 className="font-display text-7xl sm:text-9xl font-black text-white tracking-tight">
          404
        </h1>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-brand-200 mt-4">
          Esta página se fue al mar
        </h2>
        <p className="mt-4 text-white/70 leading-relaxed max-w-md mx-auto">
          La página que buscas no existe o fue movida. Pero no te preocupes,
          tenemos todo el catálogo fresco esperándote en la página principal.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-amber-brand-500 hover:bg-amber-brand-600 text-white">
            <Link href="/">
              <Home className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white">
            <a href="https://wa.me/526616123456" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>

        <p className="mt-12 text-xs text-white/40">
          © {new Date().getFullYear()} Mariscos El Jona · Rosarito, Baja California
        </p>
      </div>
    </div>
  );
}
