import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      customer: true,
      assignedTo: { select: { id: true, name: true } },
    },
  });
  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(order);
}

// PUT /api/admin/orders/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    const body = await req.json();
    const { items, ...orderData } = body;

    let subtotal: number | undefined;
    let total: number | undefined;
    if (items) {
      subtotal = items.reduce((sum: number, it: any) => sum + (it.quantity * it.unitPrice), 0);
      const deliveryCost = orderData.deliveryCost ?? 0;
      total = subtotal + deliveryCost;
    }

    const updated = await db.order.update({
      where: { id },
      data: {
        ...orderData,
        ...(subtotal !== undefined ? { subtotal } : {}),
        ...(total !== undefined ? { total } : {}),
      },
      include: { items: true },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/admin/orders/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await db.order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
