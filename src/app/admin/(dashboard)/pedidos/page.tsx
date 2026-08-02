"use client";

import { useCallback, useEffect, useState } from "react";
import { ShoppingCart, Phone, MessageCircle, Calendar, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  channel: string;
  status: string;
  subtotal: number;
  deliveryCost: number;
  total: number;
  deliveryAddress?: string | null;
  deliveryCity?: string | null;
  deliveryDate?: string | null;
  notes?: string | null;
  source: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    presentation?: string | null;
    quantity: number;
    unit: string;
    unitPrice: number;
    subtotal: number;
  }>;
};

const statusConfig: Record<string, { label: string; color: string; next?: string }> = {
  NUEVO: { label: "Nuevo", color: "bg-blue-100 text-blue-700 border-blue-200", next: "EN_REVISION" },
  EN_REVISION: { label: "En revisión", color: "bg-amber-100 text-amber-700 border-amber-200", next: "COTIZADO" },
  COTIZADO: { label: "Cotizado", color: "bg-purple-100 text-purple-700 border-purple-200", next: "CONFIRMADO" },
  CONFIRMADO: { label: "Confirmado", color: "bg-emerald-100 text-emerald-700 border-emerald-200", next: "EN_PREPARACION" },
  EN_PREPARACION: { label: "En preparación", color: "bg-cyan-100 text-cyan-700 border-cyan-200", next: "EN_RUTA" },
  EN_RUTA: { label: "En ruta", color: "bg-indigo-100 text-indigo-700 border-indigo-200", next: "ENTREGADO" },
  ENTREGADO: { label: "Entregado", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELADO: { label: "Cancelado", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

const mxn = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const url = statusFilter !== "all" ? `/api/admin/orders?status=${statusFilter}` : "/api/admin/orders";
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const url = statusFilter !== "all" ? `/api/admin/orders?status=${statusFilter}` : "/api/admin/orders";
      const res = await fetch(url);
      const data = await res.json();
      if (cancelled) return;
      setOrders(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [statusFilter]);

  const updateStatus = async (order: Order, newStatus: string) => {
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      toast.success(`Estado actualizado a "${statusConfig[newStatus]?.label}"`);
      load();
      if (selected?.id === order.id) {
        setSelected({ ...order, status: newStatus });
      }
    } else {
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground mt-1">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
            {statusFilter !== "all" && ` · filtrado por ${statusConfig[statusFilter]?.label}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {Object.entries(statusConfig).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No hay pedidos {statusFilter !== "all" && "con este estado"}.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Cuando un cliente cotice desde la web, aparecerá aquí automáticamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const cfg = statusConfig[o.status] || statusConfig.NUEVO;
            return (
              <Card
                key={o.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelected(o)}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-ocean-700">
                          {o.code}
                        </span>
                        <Badge variant="outline" className={cn("text-[10px]", cfg.color)}>
                          {cfg.label}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {o.channel === "MAYOREO" ? "Mayoreo" : "Menudeo"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {o.source}
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground mt-2">
                        {o.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {o.items.length} {o.items.length === 1 ? "producto" : "productos"} ·{" "}
                        {new Date(o.createdAt).toLocaleString("es-MX", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="font-display text-xl font-bold text-foreground">
                          {mxn(o.total)}
                        </p>
                        {o.deliveryCost > 0 && (
                          <p className="text-[10px] text-muted-foreground">
                            envío {mxn(o.deliveryCost)}
                          </p>
                        )}
                      </div>
                      {cfg.next && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(o, cfg.next!);
                          }}
                          className="hidden sm:flex"
                        >
                          → {statusConfig[cfg.next]?.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de detalle */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="font-mono">{selected.code}</span>
                <Badge variant="outline" className={cn("text-[10px]", statusConfig[selected.status]?.color)}>
                  {statusConfig[selected.status]?.label}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Cliente */}
              <div className="rounded-lg border border-border p-4 space-y-2">
                <h3 className="font-semibold text-sm">Cliente</h3>
                <p className="font-medium text-foreground">{selected.customerName}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a
                    href={`tel:${selected.customerPhone}`}
                    className="inline-flex items-center gap-1.5 text-ocean-700 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {selected.customerPhone}
                  </a>
                  <a
                    href={`https://wa.me/${selected.customerPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-600 hover:underline"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
                {selected.customerEmail && (
                  <p className="text-sm text-muted-foreground">{selected.customerEmail}</p>
                )}
              </div>

              {/* Items */}
              <div className="rounded-lg border border-border p-4 space-y-2">
                <h3 className="font-semibold text-sm">Productos</h3>
                <div className="space-y-2">
                  {selected.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium">{it.productName}</p>
                        {it.presentation && (
                          <p className="text-xs text-muted-foreground">{it.presentation}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {it.quantity} {it.unit} × {mxn(it.unitPrice)}
                        </p>
                      </div>
                      <p className="font-semibold">{mxn(it.subtotal)}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 mt-3 border-t border-border space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{mxn(selected.subtotal)}</span>
                  </div>
                  {selected.deliveryCost > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Envío</span>
                      <span>{mxn(selected.deliveryCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span className="font-display text-lg">{mxn(selected.total)}</span>
                  </div>
                </div>
              </div>

              {/* Entrega */}
              {(selected.deliveryAddress || selected.deliveryDate) && (
                <div className="rounded-lg border border-border p-4 space-y-1">
                  <h3 className="font-semibold text-sm">Entrega</h3>
                  {selected.deliveryAddress && (
                    <p className="text-sm text-foreground">{selected.deliveryAddress}</p>
                  )}
                  {selected.deliveryCity && (
                    <p className="text-sm text-muted-foreground">{selected.deliveryCity}</p>
                  )}
                  {selected.deliveryDate && (
                    <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(selected.deliveryDate).toLocaleString("es-MX")}
                    </p>
                  )}
                </div>
              )}

              {/* Notas */}
              {selected.notes && (
                <div className="rounded-lg border border-border p-4 space-y-1">
                  <h3 className="font-semibold text-sm">Notas</h3>
                  <p className="text-sm text-muted-foreground">{selected.notes}</p>
                </div>
              )}

              {/* Cambiar estado */}
              <div className="rounded-lg border border-border p-4 space-y-2">
                <h3 className="font-semibold text-sm">Cambiar estado</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <Button
                      key={k}
                      size="sm"
                      variant={selected.status === k ? "default" : "outline"}
                      className={cn(
                        selected.status === k && "bg-ocean-600 hover:bg-ocean-700 text-white"
                      )}
                      onClick={() => updateStatus(selected, k)}
                    >
                      {v.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
