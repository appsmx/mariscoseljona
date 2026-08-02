import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/products — catálogo público (solo productos activos)
export async function GET() {
  const products = await db.product.findMany({
    where: { active: true },
    include: {
      category: true,
      presentations: { orderBy: { sortOrder: "asc" } },
      prices: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  const mapped = products.map((p) => ({
    id: p.slug,
    dbId: p.id,
    name: p.name,
    scientific: p.scientific,
    category: p.category.slug,
    image: p.image,
    description: p.description,
    presentation: p.presentations.map((pr) => pr.name),
    availability: p.availability === "DIARIA" ? "Diaria"
      : p.availability === "TEMPORADA" ? "Temporada"
      : "Bajo pedido",
    tags: [
      ...p.prices.filter(pr => pr.channel === "MAYOREO").length ? ["mayoreo" as const] : [],
      ...p.prices.filter(pr => pr.channel === "MENUDEO").length ? ["menudeo" as const] : [],
      p.availability === "DIARIA" ? "fresco" as const : "congelado" as const,
      ...(p.featured ? ["premium" as const] : []),
    ],
    prices: p.prices.map(pr => ({
      channel: pr.channel === "MAYOREO" ? "mayoreo" : "menudeo",
      presentation: pr.presentation,
      pricePerKg: pr.pricePerKg,
      priceUnit: pr.priceUnit,
      unit: pr.unit,
      minQuantity: pr.minQuantity,
      notes: pr.notes,
    })),
  }));

  return NextResponse.json(mapped);
}
