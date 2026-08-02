import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const data = await db.faq.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(data);
}
