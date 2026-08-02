"use client";

import { useApi } from "@/hooks/use-api";
import { siteConfig as fallbackConfig } from "@/lib/site-data";

/**
 * Hook que carga la configuración pública del sitio desde la API.
 * Hace fallback al site-data.ts estático si la API no responde,
 * para que el sitio nunca quede en blanco.
 */
export function useSiteConfig() {
  const { data, loading, error } = useApi<any>("/api/public/site");

  // Si hay error o está cargando sin datos, usar el fallback
  if (loading && !data) {
    return { data: fallbackConfig, loading: true, error: null };
  }
  if (error || !data) {
    return { data: fallbackConfig, loading: false, error };
  }

  // Mapear el formato de la API al formato que usa el frontend
  const mapped = {
    brand: {
      name: data.brand.name,
      tagline: data.brand.tagline,
      slogan: data.brand.slogan,
      foundedYear: data.brand.foundedYear,
      trajectoryYears: data.brand.trajectoryYears,
      description: data.brand.description,
    },
    contact: {
      phone: data.contact.phone,
      phoneDisplay: data.contact.phoneDisplay,
      whatsapp: data.contact.whatsapp,
      whatsappMessage: data.contact.whatsappMessage,
      email: data.contact.email,
      address: data.contact.address,
      hours: data.contact.hours,
    },
    social: data.social,
    images: data.images,
    stats: data.stats || fallbackConfig.stats,
    differentiators: data.differentiators || [],
  };

  return { data: mapped, loading: false, error: null };
}
