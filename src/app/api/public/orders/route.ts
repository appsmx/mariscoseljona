import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderCode } from "@/lib/admin";

/**
 * POST /api/public/orders
 * Crea una cotización/pedido desde la web pública.
 * No requiere autenticación.
 *
 * Body:
 * {
 *   customerName: string,
 *   customerPhone: string,
 *   customerEmail?: string,
 *   channel: "MAYOREO" | "MENUDEO",
 *   deliveryAddress?: string,
 *   deliveryCity?: string,
 *   deliveryDate?: string (ISO),
 *   notes?: string,
 *   items: [{ productId?, productName, presentation?, quantity, unit, unitPrice }]
 * }
 *
 * El endpoint:
 *  1. Genera un código secuencial (MEJ-2026-0001)
 *  2. Calcula subtotal y total automáticamente
 *  3. Crea el pedido con status "NUEVO"
 *  4. Si el cliente ya existe por teléfono, lo vincula; si no, lo crea
 *  5. Devuelve el pedido creado con el código
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validación mínima
    if (!body.customerName || !body.customerPhone || !body.items?.length) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios: nombre, teléfono e items" },
        { status: 400 }
      );
    }

    const channel = body.channel === "MAYOREO" ? "MAYOREO" : "MENUDEO";

    // Buscar o crear cliente por teléfono
    const cleanPhone = body.customerPhone.replace(/\s/g, "");
    let customer = await db.customer.findUnique({
      where: { phone: cleanPhone },
    });
    if (!customer) {
      customer = await db.customer.create({
        data: {
          name: body.customerName,
          phone: cleanPhone,
          email: body.customerEmail || null,
          channel,
          businessName: body.businessName || null,
          rfc: body.rfc || null,
          address: body.deliveryAddress || null,
          city: body.deliveryCity || null,
          state: body.deliveryState || null,
        },
      });
    } else {
      // Actualizar canal si es mayorista
      if (channel === "MAYOREO" && customer.channel !== "MAYOREO") {
        await db.customer.update({
          where: { id: customer.id },
          data: { channel: "MAYOREO" },
        });
      }
    }

    // Generar código secuencial
    const year = new Date().getFullYear();
    const count = await db.order.count({
      where: { code: { startsWith: `MEJ-${year}-` } },
    });
    const code = generateOrderCode(count + 1, year);

    // Calcular subtotal
    const items = body.items.map((it: any) => {
      const subtotal = Number(it.quantity) * Number(it.unitPrice || 0);
      return {
        productId: it.productId || null,
        productName: it.productName || "Producto",
        presentation: it.presentation || null,
        quantity: Number(it.quantity),
        unit: it.unit || "kg",
        unitPrice: Number(it.unitPrice || 0),
        subtotal,
        notes: it.notes || null,
      };
    });
    const subtotal = items.reduce((sum: number, it: any) => sum + it.subtotal, 0);
    const deliveryCost = Number(body.deliveryCost) || 0;
    const total = subtotal + deliveryCost;

    // Crear pedido
    const order = await db.order.create({
      data: {
        code,
        customerId: customer.id,
        customerName: body.customerName,
        customerPhone: cleanPhone,
        customerEmail: body.customerEmail || null,
        channel,
        status: "NUEVO",
        subtotal,
        deliveryCost,
        total,
        deliveryAddress: body.deliveryAddress || null,
        deliveryCity: body.deliveryCity || null,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        notes: body.notes || null,
        source: "web",
        items: { create: items },
      },
      include: { items: true, customer: true },
    });

    return NextResponse.json(
      {
        ok: true,
        order: {
          id: order.id,
          code: order.code,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error creando pedido público:", e);
    return NextResponse.json(
      { error: "Error al procesar la cotización", detail: e.message },
      { status: 500 }
    );
  }
}
