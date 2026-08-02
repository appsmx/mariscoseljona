import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const zones = await db.coverageZone.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({
    primary: zones.filter((z) => z.type === "primary").map((z) => z.name),
    extended: zones.filter((z) => z.type === "extended").map((z) => z.name),
    deliverySchedule:
      "Entregas lunes a sábado. Pedidos antes de las 11:00 AM se entregan el mismo día en zona metropolitana.",
  });
}
