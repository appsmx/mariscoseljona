import { NextRequest, NextResponse } from "next/server";
import { processCustomerMessage } from "@/lib/ai-agent";

/**
 * POST /api/chat
 * Endpoint público del agente conversacional.
 *
 * Body:
 * {
 *   message: string,
 *   sessionId: string,   // identificador de la sesión (generado client-side)
 *   history?: Array<{ role: "user" | "assistant", content: string }>
 * }
 *
 * Response:
 * {
 *   content: string,        // texto del agente
 *   actions?: ChatAction[], // acciones sugeridas (abrir carrito, whatsapp, etc.)
 *   needsHuman?: boolean,   // si debe escalarse a humano
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mensaje requerido" },
        { status: 400 }
      );
    }

    // Validar y limpiar historial (máx 20 mensajes, solo texto)
    const cleanHistory = Array.isArray(history)
      ? history
          .filter(
            (m: any) =>
              m &&
              typeof m.content === "string" &&
              (m.role === "user" || m.role === "assistant")
          )
          .slice(-20)
          .map((m: any) => ({ role: m.role, content: m.content.slice(0, 1000) }))
      : [];

    // Limitar longitud del mensaje del usuario
    const cleanMessage = message.slice(0, 1000);

    const response = await processCustomerMessage(cleanMessage, cleanHistory);

    return NextResponse.json({
      content: response.content,
      actions: response.actions,
      needsHuman: response.needsHuman,
    });
  } catch (error: any) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      {
        content:
          "Disculpá, tuve un problema técnico. Escribinos por WhatsApp al (669) 123-4567 y te atendemos al instante.",
        actions: [
          {
            type: "open_whatsapp",
            message: "Hola Mariscos El Jona, vengo desde el chat de la web.",
          },
        ],
        needsHuman: true,
      },
      { status: 200 }
    );
  }
}
