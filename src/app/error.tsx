"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error de aplicación:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-950 px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/20 ring-1 ring-rose-400/30 mb-8 mx-auto">
          <AlertTriangle className="h-10 w-10 text-rose-300" />
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Algo salió mal
        </h1>
        <p className="mt-4 text-white/70 leading-relaxed max-w-md mx-auto">
          Hubo un problema al cargar esta página. Intentá de nuevo,
          o volvé al inicio. Si el problema persiste, escribinos por WhatsApp.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-white/40 font-mono">
            Código de error: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg" className="bg-amber-brand-500 hover:bg-amber-brand-600 text-white">
            <RefreshCw className="h-4 w-4" />
            Intentar de nuevo
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white">
            <Link href="/">
              <Home className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
