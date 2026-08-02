"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Save, Star, MessageSquare, HelpCircle, Award, Map, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Content = {
  testimonials: any[];
  faqs: any[];
  brands: any[];
  differentiators: any[];
  stats: any[];
  coverage: any[];
  hours: any[];
};

export default function AdminContent() {
  const [data, setData] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/content");
    const d = await res.json();
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch("/api/admin/content");
      const d = await res.json();
      if (cancelled) return;
      setData(d);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [load]);

  // Helpers genéricos para CRUD por entidad
  const update = (entity: keyof Content, id: string, field: string, value: any) => {
    if (!data) return;
    setData({
      ...data,
      [entity]: data[entity].map((it: any) =>
        it.id === id ? { ...it, [field]: value } : it
      ),
    });
  };

  const add = (entity: keyof Content, base: any) => {
    if (!data) return;
    const newItem = {
      ...base,
      id: `new-${Date.now()}`,
      sortOrder: data[entity].length,
    };
    setData({ ...data, [entity]: [...data[entity], newItem] });
  };

  const remove = async (entity: keyof Content, id: string) => {
    if (id.startsWith("new-")) {
      setData({
        ...data!,
        [entity]: data![entity].filter((it: any) => it.id !== id),
      });
      return;
    }
    if (!confirm("¿Eliminar este elemento?")) return;
    setSaving(`${entity}-${id}`);
    // Eliminar vía API directa (usamos el endpoint genérico del modelo)
    const res = await fetch(`/api/admin/content/${entity}/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Eliminado");
      load();
    } else {
      toast.error("Error al eliminar");
    }
    setSaving(null);
  };

  const saveItem = async (entity: keyof Content, item: any) => {
    setSaving(`${entity}-${item.id}`);
    const isNew = item.id.startsWith("new-");
    const { id, ...body } = item;
    const url = isNew
      ? `/api/admin/content/${entity}`
      : `/api/admin/content/${entity}/${id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success("Guardado");
      load();
    } else {
      toast.error("Error al guardar");
    }
    setSaving(null);
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Contenido</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona testimonios, preguntas frecuentes, marcas, estadísticas y cobertura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TESTIMONIOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-ocean-600" />
                Testimonios
              </span>
              <Button size="sm" variant="outline" onClick={() => add("testimonials", { name: "", role: "", location: "", rating: 5, quote: "", active: true })}>
                <Plus className="h-3.5 w-3.5" />
                Nuevo
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {data.testimonials.map((t) => (
              <div key={t.id} className="rounded-lg border border-border p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input value={t.name} onChange={(e) => update("testimonials", t.id, "name", e.target.value)} placeholder="Nombre" className="h-9" />
                  <Input value={t.role} onChange={(e) => update("testimonials", t.id, "role", e.target.value)} placeholder="Rol" className="h-9" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={t.location} onChange={(e) => update("testimonials", t.id, "location", e.target.value)} placeholder="Ubicación" className="h-9" />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => update("testimonials", t.id, "rating", n)}>
                        <Star className={cn("h-4 w-4", n <= t.rating ? "fill-amber-brand-400 text-amber-brand-400" : "text-muted-foreground")} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea value={t.quote} onChange={(e) => update("testimonials", t.id, "quote", e.target.value)} placeholder="Cita textual" rows={2} className="text-sm" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={t.active} onCheckedChange={(v) => update("testimonials", t.id, "active", v)} />
                    <Label className="text-xs">{t.active ? "Activo" : "Inactivo"}</Label>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => saveItem("testimonials", t)} disabled={saving === `testimonials-${t.id}`}>
                      {saving === `testimonials-${t.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove("testimonials", t.id)} className="text-rose-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {data.testimonials.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Sin testimonios.</p>}
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-ocean-600" />
                Preguntas frecuentes
              </span>
              <Button size="sm" variant="outline" onClick={() => add("faqs", { question: "", answer: "", active: true })}>
                <Plus className="h-3.5 w-3.5" />
                Nueva
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {data.faqs.map((f) => (
              <div key={f.id} className="rounded-lg border border-border p-3 space-y-2">
                <Input value={f.question} onChange={(e) => update("faqs", f.id, "question", e.target.value)} placeholder="Pregunta" className="h-9" />
                <Textarea value={f.answer} onChange={(e) => update("faqs", f.id, "answer", e.target.value)} placeholder="Respuesta" rows={2} className="text-sm" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={f.active} onCheckedChange={(v) => update("faqs", f.id, "active", v)} />
                    <Label className="text-xs">{f.active ? "Activa" : "Inactiva"}</Label>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => saveItem("faqs", f)} disabled={saving === `faqs-${f.id}`}>
                      {saving === `faqs-${f.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove("faqs", f.id)} className="text-rose-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {data.faqs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Sin FAQs.</p>}
          </CardContent>
        </Card>

        {/* STATS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-brand-600" />
                Estadísticas (hero)
              </span>
              <Button size="sm" variant="outline" onClick={() => add("stats", { value: "", label: "", active: true })}>
                <Plus className="h-3.5 w-3.5" />
                Nueva
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.stats.map((s) => (
              <div key={s.id} className="flex gap-2 items-center">
                <Input value={s.value} onChange={(e) => update("stats", s.id, "value", e.target.value)} placeholder="+17" className="h-9 w-24" />
                <Input value={s.label} onChange={(e) => update("stats", s.id, "label", e.target.value)} placeholder="Años de trayectoria" className="h-9 flex-1" />
                <Button size="sm" variant="ghost" onClick={() => saveItem("stats", s)} disabled={saving === `stats-${s.id}`}>
                  {saving === `stats-${s.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove("stats", s.id)} className="text-rose-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* COBERTURA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Map className="h-5 w-5 text-emerald-600" />
                Zonas de cobertura
              </span>
              <Button size="sm" variant="outline" onClick={() => add("coverage", { name: "", type: "primary", active: true })}>
                <Plus className="h-3.5 w-3.5" />
                Nueva
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {data.coverage.map((z) => (
              <div key={z.id} className="flex gap-2 items-center">
                <Badge variant="outline" className={cn("text-[10px]", z.type === "primary" ? "bg-ocean-50 text-ocean-700" : "bg-amber-brand-50 text-amber-brand-700")}>
                  {z.type === "primary" ? "Primaria" : "Extendida"}
                </Badge>
                <Input value={z.name} onChange={(e) => update("coverage", z.id, "name", e.target.value)} placeholder="Ciudad o zona" className="h-9 flex-1" />
                <Button size="sm" variant="ghost" onClick={() => update("coverage", z.id, "type", z.type === "primary" ? "extended" : "primary")} title="Cambiar tipo">
                  ↔
                </Button>
                <Button size="sm" variant="ghost" onClick={() => saveItem("coverage", z)} disabled={saving === `coverage-${z.id}`}>
                  {saving === `coverage-${z.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove("coverage", z.id)} className="text-rose-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
