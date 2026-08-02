import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/site — configuración pública del sitio (sin datos sensibles)
export async function GET() {
  const config = await db.siteConfig.findUnique({ where: { id: "singleton" } });
  if (!config) return NextResponse.json({ error: "No configurado" }, { status: 404 });

  const hours = await db.businessHour.findMany({ orderBy: { sortOrder: "asc" } });
  const stats = await db.stat.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  const differentiators = await db.differentiator.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({
    brand: {
      name: config.brandName,
      tagline: config.tagline,
      slogan: config.slogan,
      description: config.description,
      foundedYear: config.foundedYear,
      trajectoryYears: new Date().getFullYear() - config.foundedYear,
    },
    contact: {
      phone: config.phone,
      phoneDisplay: config.phoneDisplay,
      whatsapp: config.whatsapp,
      whatsappMessage: config.whatsappMessage,
      email: config.email,
      address: {
        street: config.streetAddress,
        city: config.city,
        state: config.state,
        zip: config.zipCode,
        country: config.country,
      },
      hours: hours.map((h) => ({ day: h.day, time: `${h.timeOpen} – ${h.timeClose}` })),
    },
    social: {
      facebook: config.facebookUrl,
      instagram: config.instagramUrl,
      tiktok: config.tiktokUrl,
    },
    images: {
      hero: config.heroImage,
      story: config.storyImage,
      ctaBanner: config.ctaBannerImage,
    },
    stats,
    differentiators,
  });
}
