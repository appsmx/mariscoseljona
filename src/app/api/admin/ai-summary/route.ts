import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { generateAdminSummary } from "@/lib/ai-agent";
import { db } from "@/lib/db";

/**
 * GET /api/admin/ai-summary
 * Genera un resumen inteligente del estado del negocio para el panel admin.
 */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayOrders, weekOrders, monthRevenue, pendingOrders, topProductsAgg] = await Promise.all([
      db.order.count({ where: { createdAt: { gte: startOfDay } } }),
      db.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      db.order.aggregate({
        where: {
          status: { in: ["CONFIRMADO", "EN_PREPARACION", "EN_RUTA", "ENTREGADO"] },
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),
      db.order.count({
        where: { status: { in: ["NUEVO", "EN_REVISION"] } },
      }),
      db.orderItem.groupBy({
        by: ["productName"],
        _count: true,
        _sum: { quantity: true },
        orderBy: { _count: { productName: "desc" } },
        take: 3,
      }),
    ]);

    const summary = await generateAdminSummary({
      todayOrders,
      weekOrders,
      monthRevenue: monthRevenue._sum.total || 0,
      pendingOrders,
      topProducts: topProductsAgg.map((p) => ({
        name: p.productName,
        qty: p._count,
      })),
    });

    return NextResponse.json({
      summary,
      stats: {
        todayOrders,
        weekOrders,
        monthRevenue: monthRevenue._sum.total || 0,
        pendingOrders,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Error al generar resumen", detail: e.message },
      { status: 500 }
    );
  }
}
