import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const t = await db.stat.update({ where: { id }, data: body });
  return NextResponse.json(t);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await db.stat.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
