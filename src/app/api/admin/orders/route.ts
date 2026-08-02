import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, generateOrderCode } from "@/lib/admin";

// GET /api/admin/orders
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Number(searchParams.get("limit") || 100);

  const orders = await db.order.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      items: true,
      customer: true,
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return NextResponse.json(orders);
}

// POST /api/admin/orders
export async function POST(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { items = [], ...orderData } = body;

    const year = new Date().getFullYear();
    const count = await db.order.count({ where: { code: { startsWith: `MEJ-${year}-` } } });
    const code = generateOrderCode(count + 1, year);

    const subtotal = items.reduce((sum: number, it: any) => sum + (it.quantity * it.unitPrice), 0);
    const deliveryCost = orderData.deliveryCost || 0;
    const total = subtotal + deliveryCost;

    const order = await db.order.create({
      data: {
        ...orderData,
        code,
        subtotal,
        deliveryCost,
        total,
        assignedToId: session?.user?.id,
        items: {
          create: items.map((it: any) => ({
            ...it,
            subtotal: it.quantity * it.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
