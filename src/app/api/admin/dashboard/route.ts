import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/dashboard
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const [
    totalProducts,
    activeProducts,
    totalOrders,
    newOrders,
    monthOrders,
    weekOrders,
    totalCustomers,
    monthRevenueAgg,
    ordersByStatus,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { active: true } }),
    db.order.count(),
    db.order.count({ where: { status: "NUEVO" } }),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.count({ where: { createdAt: { gte: startOfWeek } } }),
    db.customer.count(),
    db.order.aggregate({
      where: {
        status: { in: ["CONFIRMADO", "EN_PREPARACION", "EN_RUTA", "ENTREGADO"] },
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
    }),
    db.order.groupBy({
      by: ["status"],
      _count: true,
    }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    db.orderItem.groupBy({
      by: ["productName"],
      _count: true,
      _sum: { quantity: true },
      orderBy: { _count: { productName: "desc" } },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    totals: {
      products: totalProducts,
      activeProducts,
      orders: totalOrders,
      newOrders,
      monthOrders,
      weekOrders,
      customers: totalCustomers,
      monthRevenue: monthRevenueAgg._sum.total || 0,
    },
    ordersByStatus: ordersByStatus.reduce((acc, o) => {
      acc[o.status] = o._count;
      return acc;
    }, {} as Record<string, number>),
    recentOrders,
    topProducts: topProducts.map((p) => ({
      name: p.productName,
      timesOrdered: p._count,
      totalQuantity: p._sum.quantity,
    })),
  });
}
