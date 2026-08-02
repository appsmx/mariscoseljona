import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      presentations: { orderBy: { sortOrder: "asc" } },
      prices: true,
    },
  });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

// PUT /api/admin/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    const body = await req.json();
    const { presentations, prices, category, ...productData } = body;

    let categoryId: string | undefined;
    if (category) {
      if (typeof category === "string") {
        const existing = await db.category.findUnique({ where: { slug: category } });
        if (existing) categoryId = existing.id;
      } else if (category.id) {
        categoryId = category.id;
      }
    }

    const updated = await db.product.update({
      where: { id },
      data: {
        ...productData,
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
    });

    if (presentations) {
      await db.productPresentation.deleteMany({ where: { productId: id } });
      if (presentations.length) {
        await db.productPresentation.createMany({
          data: presentations.map((p: any, i: number) => ({
            productId: id,
            name: p.name || p,
            sortOrder: i,
          })),
        });
      }
    }

    if (prices) {
      await db.productPrice.deleteMany({ where: { productId: id } });
      if (prices.length) {
        await db.productPrice.createMany({
          data: prices.map((p: any) => ({ ...p, productId: id })),
        });
      }
    }

    const finalProduct = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        presentations: { orderBy: { sortOrder: "asc" } },
        prices: true,
      },
    });
    return NextResponse.json(finalProduct);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
