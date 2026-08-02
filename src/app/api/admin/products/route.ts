import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/products — lista todos los productos
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await db.product.findMany({
    include: {
      category: true,
      presentations: { orderBy: { sortOrder: "asc" } },
      prices: { orderBy: { channel: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(products);
}

// POST /api/admin/products — crea un producto
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { presentations = [], prices = [], category, ...productData } = body;

    let categoryId: string;
    if (typeof category === "string") {
      const existing = await db.category.findUnique({ where: { slug: category } });
      if (!existing) {
        const created = await db.category.create({
          data: { slug: category, name: category.charAt(0).toUpperCase() + category.slice(1) },
        });
        categoryId = created.id;
      } else {
        categoryId = existing.id;
      }
    } else {
      categoryId = category.id;
    }

    const slug = productData.slug || productData.name.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const product = await db.product.create({
      data: {
        ...productData,
        slug,
        categoryId,
        presentations: presentations.length
          ? { create: presentations.map((p: any, i: number) => ({ name: p.name || p, sortOrder: i })) }
          : undefined,
        prices: prices.length
          ? { create: prices.map((p: any) => ({ ...p, productId: undefined })) }
          : undefined,
      },
      include: { category: true, presentations: true, prices: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
