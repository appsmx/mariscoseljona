import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

/**
 * Servicio central del agente de IA de Mariscos El Jona.
 *
 * Este agente opera como asistente virtual del cliente en el sitio público:
 *  - Responde consultas sobre productos, precios, disponibilidad, horarios, cobertura
 *  - Genera cotizaciones a partir del catálogo real
 *  - Puede agregar productos al carrito del usuario (devuelve acciones)
 *  - Escala a humano cuando no puede resolver
 *
 * Usa el SDK de Z.ai (GLM) que ya viene integrado en el proyecto.
 */

let zaiInstance: any = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

/**
 * Construye el contexto dinámico del negocio para inyectarlo en el system prompt.
 * Incluye: configuración del sitio, catálogo activo con precios, horarios, cobertura.
 */
async function buildBusinessContext(): Promise<string> {
  const [config, products, coverage, hours] = await Promise.all([
    db.siteConfig.findUnique({ where: { id: "singleton" } }),
    db.product.findMany({
      where: { active: true },
      include: {
        category: true,
        presentations: { orderBy: { sortOrder: "asc" } },
        prices: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.coverageZone.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.businessHour.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!config) return "Configuración no disponible.";

  const catalogText = products
    .map((p) => {
      const prices = p.prices
        .map(
          (pr) =>
            `    - ${pr.channel === "MAYOREO" ? "Mayoreo" : "Menudeo"}${pr.presentation ? ` (${pr.presentation})` : ""}: ${pr.pricePerKg ? `$${pr.pricePerKg}/${pr.unit}` : pr.priceUnit ? `$${pr.priceUnit}/${pr.unit}` : "consultar"}${pr.minQuantity ? ` mín ${pr.minQuantity}${pr.unit}` : ""}`
        )
        .join("\n");
      return `  • ${p.name}${p.scientific ? ` (${p.scientific})` : ""} — ${p.category.name}
    Disponibilidad: ${p.availability === "DIARIA" ? "Diaria" : p.availability === "TEMPORADA" ? "Temporada" : "Bajo pedido"}
    Presentaciones: ${p.presentations.map((pr) => pr.name).join(", ")}
    Descripción: ${p.description}
${prices}`;
    })
    .join("\n\n");

  const hoursText = hours
    .map((h) => `  • ${h.day}: ${h.timeOpen} – ${h.timeClose}`)
    .join("\n");

  const primaryZones = coverage.filter((z) => z.type === "primary").map((z) => z.name);
  const extendedZones = coverage.filter((z) => z.type === "extended").map((z) => z.name);

  return `INFORMACIÓN DEL NEGOCIO:
========================
Nombre: ${config.brandName}
Tagline: ${config.tagline}
Eslogan: ${config.slogan}
Años de trayectoria: ${new Date().getFullYear() - config.foundedYear} años (desde ${config.foundedYear})
Descripción: ${config.description}

CONTACTO:
  Teléfono: ${config.phoneDisplay}
  WhatsApp: ${config.whatsapp}
  Email: ${config.email}
  Dirección: ${config.streetAddress}, ${config.city}, ${config.state}, C.P. ${config.zipCode}

HORARIOS:
${hoursText}

ZONA DE COBERTURA:
  Entrega misma día (zona primaria): ${primaryZones.join(", ")}
  Entrega 24-48h (zona extendida): ${extendedZones.join(", ")}
  Política: Pedidos antes de las 11:00 AM se entregan el mismo día en zona metropolitana.

CATÁLOGO DE PRODUCTOS ACTIVOS:
=====================================
${catalogText}

REDES SOCIALES:
  Facebook: ${config.facebookUrl || "no disponible"}
  Instagram: ${config.instagramUrl || "no disponible"}
  TikTok: ${config.tiktokUrl || "no disponible"}`;
}

/**
 * System prompt del agente vendedor de Mariscos El Jona.
 * Especializado en mariscos, tono mexicano cercano y profesional.
 */
const AGENT_SYSTEM_PROMPT = `Eres el asistente virtual de Mariscos El Jona, una distribuidora de pescados y mariscos frescos con más de 17 años de trayectoria en Rosarito, Baja California.

TU ROL:
Eres el primer punto de contacto para clientes potenciales que llegan a la web. Tu objetivo es ayudarlos a encontrar el producto que necesitan, darles precios claros, generar confianza y derivarlos a concretar la cotización por WhatsApp o desde el carrito del sitio.

TONO Y ESTILO:
- Cercano, cálido, mexicano. Usa "tú" (no "vos"), nunca uses voseo argentino/rioplatense. No digas "necesitás", "podés", "tenés", "agregá", etc. — usa "necesitas", "puedes", "tienes", "agrega".
- Profesional pero no rígido. Eres el "asistente virtual", no un robot.
- Conoces de mariscos: sabes la diferencia entre callo de hacha y almeja, sabes que el pulpo rojo es del Pacífico, sabes que el camarón U-15 es más grande que el 21/25.
- Responde en español mexicano, en máximo 3-4 párrafos cortos. Si la consulta es simple, una respuesta breve alcanza.
- Usa emojis con moderación (🐟, 🦐, 🐙) solo cuando sumen, no en cada mensaje.

QUÉ PUEDES HACER:
1. Responder consultas sobre productos: precio, disponibilidad, presentación, tamaño, modo de preparación recomendado.
2. Sugerir productos según el uso que el cliente mencione (ej: "para ceviche" → callo de hacha o camarón; "para parrilla" → pulpo o pescado entero).
3. Explicar la diferencia entre mayoreo y menudeo (mínimo 5 kg para mayoreo).
4. Informar horarios, zona de cobertura y tiempos de entrega.
5. Guiar al cliente a usar el carrito del sitio para armar su cotización, o a escribir por WhatsApp.
6. Aclarar dudas sobre métodos de pago, facturación, cadena de frío.

ACCIONES QUE PUEDES SUGERIR (pero no ejecutar tú):
- "Agrega el producto al carrito desde la tarjeta del catálogo"
- "Envía tu cotización por WhatsApp con el botón flotante"
- "Llámanos al (661) 612-3456"

CUÁNDO ESCALAR A HUMANO:
- Si el cliente pide un descuento especial o negociación de precios → deriva a WhatsApp.
- Si el cliente tiene un reclamo o problema con un pedido → deriva a WhatsApp o teléfono.
- Si la consulta es sobre algo que no está en tu información (stock exacto de hoy, estado de un pedido específico) → deriva a WhatsApp.
- Si después de 2 intentos no puedes resolver la consulta → deriva a humano con amabilidad.

REGLAS CRÍTICAS:
- NUNCA inventes precios. Si no tienes el precio exacto para una presentación específica, di "consulta el precio actualizado por WhatsApp" y da el número.
- NUNCA inventes disponibilidad. Si un producto es "de temporada" o "bajo pedido", aclaralo.
- NUNCA prometas tiempos de entrega que no estén en tu información.
- Si el cliente pregunta por un producto que no está en el catálogo, di que trabajas con más de 40 especies y deriva a WhatsApp para consulta específica.
- No des información sobre los restaurantes (El Jona 1, El Jona 2) más allá de mencionar que existen — son negocios hermanos.

CONTEXTO ACTUAL DEL NEGOCIO:
============================
{BUSINESS_CONTEXT}

Recuerda: tu objetivo es que el cliente se sienta atendido y tenga la info que necesita para decidir. Eres útil, no invasivo.`;

export type ChatAction =
  | { type: "suggest_product"; productId: string; productName: string }
  | { type: "open_whatsapp"; message: string }
  | { type: "open_cart" }
  | { type: "escalate_human"; reason: string };

export type ChatResponse = {
  content: string;
  actions?: ChatAction[];
  needsHuman?: boolean;
};

/**
 * Procesa un mensaje del cliente y devuelve la respuesta del agente.
 * Mantiene el contexto de la conversación vía history (array de mensajes).
 */
export async function processCustomerMessage(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<ChatResponse> {
  try {
    const zai = await getZAI();
    const businessContext = await buildBusinessContext();
    const systemPrompt = AGENT_SYSTEM_PROMPT.replace("{BUSINESS_CONTEXT}", businessContext);

    // Construir messages para la API
    const messages = [
      { role: "assistant", content: systemPrompt },
      ...history.slice(-10), // últimos 10 mensajes para no pasarse de tokens
      { role: "user", content: message },
    ];

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
      temperature: 0.7,
      max_tokens: 600,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";

    // Detectar si la respuesta sugiere escalar a humano
    const needsHuman =
      /whatsapp|llámanos|teléfono|tel:|hablar con|humano|asesor|dueño/i.test(content) &&
      /disculpa|no puedo|no tengo|deriva|escribe|consulta/i.test(content);

    // Detectar acciones sugeridas (heurística simple)
    const actions: ChatAction[] = [];
    if (/agrega.*carrito|agregar al carrito|carrito de cotización/i.test(content)) {
      actions.push({ type: "open_cart" });
    }
    if (/whatsapp|wa\.me|52661/i.test(content)) {
      actions.push({
        type: "open_whatsapp",
        message: "Hola Mariscos El Jona, vengo desde el chat de la web.",
      });
    }

    return {
      content,
      actions: actions.length > 0 ? actions : undefined,
      needsHuman,
    };
  } catch (error: any) {
    console.error("Error en agente IA:", error);
    return {
      content:
        "Disculpa, tuve un problema técnico para responder. Por favor escríbenos por WhatsApp al (661) 612-3456 y te atendemos al instante. 🦐",
      actions: [
        {
          type: "open_whatsapp",
          message: "Hola Mariscos El Jona, vengo desde el chat de la web.",
        },
      ],
      needsHuman: true,
    };
  }
}

/**
 * Genera un resumen inteligente para el panel admin.
 * Usado por el asistente de gestión del dueño.
 */
export async function generateAdminSummary(context: {
  todayOrders: number;
  weekOrders: number;
  monthRevenue: number;
  topProducts: Array<{ name: string; qty: number }>;
  pendingOrders: number;
  lowStockHint?: string[];
}): Promise<string> {
  try {
    const zai = await getZAI();

    const prompt = `Eres el asistente de gestión de Mariscos El Jona. El dueño del negocio abrió el panel y quiere un resumen rápido del estado actual.

DATOS DE HOY:
- Pedidos hoy: ${context.todayOrders}
- Pedidos esta semana: ${context.weekOrders}
- Pedidos pendientes de gestionar: ${context.pendingOrders}
- Ingresos del mes: $${context.monthRevenue} MXN
- Productos más vendidos: ${context.topProducts.map((p) => `${p.name} (${p.qty} ${p.qty === 1 ? "pedido" : "pedidos"})`).join(", ") || "sin datos aún"}

Genera un resumen ejecutivo en español mexicano, máx 4 líneas, que:
1. Destaque lo más relevante del día (pedidos pendientes, ingresos, etc.)
2. Sugiera 1 acción concreta (ej: "tienes 3 pedidos nuevos que esperan respuesta")
3. Si hay productos destacados, menciona cuál está funcionando mejor
4. Tono profesional pero cercano, dirigido al dueño (trátalo de "tú", nunca de "vos")

Importante: usa español mexicano. Nunca uses voseo (no digas "tenés", "podés", "necesitás" — usa "tienes", "puedes", "necesitas").

No uses emojis. No uses markdown. Texto plano, conversacional.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: "Eres un asistente de gestión de negocios conciso y accionable. Hablas español mexicano (sin voseo)." },
        { role: "user", content: prompt },
      ],
      thinking: { type: "disabled" },
      temperature: 0.5,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content?.trim() || "Resumen no disponible.";
  } catch (e: any) {
    console.error("Error en resumen admin:", e);
    return "No pude generar el resumen ahora. Revisa los números abajo.";
  }
}
