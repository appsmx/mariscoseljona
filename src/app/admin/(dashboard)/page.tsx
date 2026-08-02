"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Dashboard = {
  totals: {
    products: number;
    activeProducts: number;
    orders: number;
    newOrders: number;
    monthOrders: number;
    weekOrders: number;
    customers: number;
    monthRevenue: number;
  };
  ordersByStatus: Record<string, number>;
  recentOrders: Array<{
    id: string;
    code: string;
    customerName: string;
    customerPhone: string;
    channel: string;
    status: string;
    total: number;
    createdAt: string;
    items: any[];
  }>;
  topProducts: Array<{
    name: string;
    timesOrdered: number;
    totalQuantity: number;
  }>;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  NUEVO: { label: "Nuevo", color: "bg-blue-100 text-blue-700 border-blue-200" },
  EN_REVISION: { label: "En revisión", color: "bg-amber-100 text-amber-700 border-amber-200" },
  COTIZADO: { label: "Cotizado", color: "bg-purple-100 text-purple-700 border-purple-200" },
  CONFIRMADO: { label: "Confirmado", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  EN_PREPARACION: { label: "En preparación", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  EN_RUTA: { label: "En ruta", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  ENTREGADO: { label: "Entregado", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELADO: { label: "Cancelado", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

const mxn = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export default function AdminDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const cards = [
    {
      label: "Productos activos",
      value: data.totals.activeProducts,
      total: data.totals.products,
      icon: Package,
      color: "text-ocean-600",
      bg: "bg-ocean-50",
    },
    {
      label: "Pedidos nuevos",
      value: data.totals.newOrders,
      total: data.totals.orders,
      icon: ShoppingCart,
      color: "text-amber-brand-600",
      bg: "bg-amber-brand-50",
    },
    {
      label: "Clientes registrados",
      value: data.totals.customers,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Ingresos del mes",
      value: mxn(data.totals.monthRevenue),
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general del negocio · {new Date().toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {c.label}
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
                      {c.value}
                    </p>
                    {c.total !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        de {c.total} total
                      </p>
                    )}
                  </div>
                  <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", c.bg)}>
                    <Icon className={cn("h-5 w-5", c.color)} />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pedidos por estado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-ocean-600" />
            Pedidos por estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.entries(statusConfig).map(([status, cfg]) => {
              const count = data.ordersByStatus[status] || 0;
              return (
                <div
                  key={status}
                  className={cn(
                    "rounded-xl border p-3 text-center",
                    count > 0 ? cfg.color : "bg-muted/30 border-border text-muted-foreground"
                  )}
                >
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide mt-1">
                    {cfg.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-ocean-600" />
              Pedidos recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Aún no hay pedidos. Cuando los clientes cotizan desde la web, aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.recentOrders.map((o) => {
                  const cfg = statusConfig[o.status] || statusConfig.NUEVO;
                  return (
                    <div
                      key={o.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-ocean-700">
                            {o.code}
                          </span>
                          <Badge variant="outline" className={cn("text-[10px]", cfg.color)}>
                            {cfg.label}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {o.channel === "MAYOREO" ? "Mayoreo" : "Menudeo"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground mt-1 truncate">
                          {o.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {o.items.length} {o.items.length === 1 ? "producto" : "productos"} ·{" "}
                          {new Date(o.createdAt).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-lg font-bold text-foreground">
                          {mxn(o.total)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowUpRight className="h-5 w-5 text-amber-brand-600" />
              Más pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Sin datos suficientes todavía.
              </p>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ocean-100 text-ocean-700 font-display font-bold text-sm">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.timesOrdered} {p.timesOrdered === 1 ? "pedido" : "pedidos"} · {p.totalQuantity} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
