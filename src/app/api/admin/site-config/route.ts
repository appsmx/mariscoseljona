import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const config = await db.siteConfig.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  const config = await db.siteConfig.upsert({
    where: { id: "singleton" },
    update: body,
    create: { id: "singleton", ...body },
  });
  return NextResponse.json(config);
}
