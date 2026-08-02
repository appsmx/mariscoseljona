import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Obtiene la sesión del usuario autenticado en Server Components / Route Handlers.
 * Devuelve null si no hay sesión.
 */
export async function getAdminSession() {
  return getServerSession(authOptions);
}

/**
 * Verifica que el usuario esté autenticado y sea ADMIN o EDITOR.
 * Devuelve { session, error } donde error es un NextResponse 401/403 si no pasa.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
    };
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return {
      session: null,
      error: NextResponse.json({ error: "Sin permisos suficientes" }, { status: 403 }),
    };
  }
  return { session, error: null };
}

/**
 * Genera el siguiente código secuencial de pedido: MEJ-2026-0001
 */
export function generateOrderCode(seq: number, year: number) {
  return `MEJ-${year}-${String(seq).padStart(4, "0")}`;
}
