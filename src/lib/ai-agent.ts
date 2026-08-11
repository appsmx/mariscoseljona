import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

/**
 * Servicio central del agente de IA de Mariscos Quiroa.
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
 * System prompt del agente vendedor de Mariscos Quiroa.
 * Especializado en mariscos, tono mexicano cercano y profesional.
 */
const AGENT_SYSTEM_PROMPT = `Eres el asistente virtual de Mariscos Quiroa, una distribuidora de pescados y mariscos frescos con más de 17 años de trayectoria en Playas de Rosarito, Baja California.

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
- No des información sobre los restaurantes (Quiroa 1, Quiroa 2) más allá de mencionar que existen — son negocios hermanos.

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
 * Si el SDK de Z.ai no está disponible (ej. en Vercel sin API key),
 * usa un fallback inteligente basado en el catálogo real.
 */
export async function processCustomerMessage(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<ChatResponse> {
  try {
    // Intentar primero con el SDK de Z.ai (GLM)
    let content = "";
    try {
      const zai = await getZAI();
      const businessContext = await buildBusinessContext();
      const systemPrompt = AGENT_SYSTEM_PROMPT.replace("{BUSINESS_CONTEXT}", businessContext);

      const messages = [
        { role: "assistant", content: systemPrompt },
        ...history.slice(-10),
        { role: "user", content: message },
      ];

      const completion = await zai.chat.completions.create({
        messages,
        thinking: { type: "disabled" },
        temperature: 0.7,
        max_tokens: 600,
      });

      content = completion.choices[0]?.message?.content?.trim() || "";
    } catch (zaiError) {
      // Si Z.ai falla (ej. en Vercel sin credenciales), usar fallback inteligente
      console.log("Z.ai SDK no disponible, usando fallback:", zaiError?.message || "unknown");
      content = await generateFallbackResponse(message);
    }

    if (!content) {
      content = await generateFallbackResponse(message);
    }

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
        message: "Hola Mariscos Quiroa, vengo desde el chat de la web.",
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
          message: "Hola Mariscos Quiroa, vengo desde el chat de la web.",
        },
      ],
      needsHuman: true,
    };
  }
}

/**
 * Genera una respuesta inteligente basada en el catálogo real.
 * Se usa cuando el SDK de Z.ai no está disponible (ej. Vercel sin API key).
 */
async function generateFallbackResponse(message: string): Promise<string> {
  try {
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

    const msg = message.toLowerCase();

    // Detectar intención: precios
    if (/precio|costo|cuanto|cuesta|vale|valor/.test(msg)) {
      const productMatch = products.find(p =>
        msg.includes(p.name.toLowerCase()) ||
        (p.scientific && msg.includes(p.scientific.toLowerCase()))
      );

      if (productMatch) {
        const mayoreo = productMatch.prices.find(pr => pr.channel === "MAYOREO");
        const menudeo = productMatch.prices.find(pr => pr.channel === "MENUDEO");
        let response = `¡Claro! Te cuento los precios de ${productMatch.name}:\n\n`;
        if (mayoreo) {
          response += `📦 **Mayoreo** (mínimo ${mayoreo.minQuantity} ${mayoreo.unit}): `;
          response += mayoreo.pricePerKg ? `$${mayoreo.pricePerKg}/${mayoreo.unit}\n` : `$${mayoreo.priceUnit}/${mayoreo.unit}\n`;
        }
        if (menudeo) {
          response += `🏠 **Menudeo** (mínimo ${menudeo.minQuantity} ${menudeo.unit}): `;
          response += menudeo.pricePerKg ? `$${menudeo.pricePerKg}/${menudeo.unit}\n` : `$${menudeo.priceUnit}/${menudeo.unit}\n`;
        }
        response += `\nPresentaciones: ${productMatch.presentations.map(p => p.name).join(", ")}\n`;
        response += `\n¿Te interesa alguna en particular? Podés agregarla al carrito o escribirnos por WhatsApp al (661) 612-3456 🦐`;
        return response;
      }
      return "Te puedo dar el precio de cualquier producto de nuestro catálogo. Tenemos: " +
        products.map(p => p.name).join(", ") + ". ¿De cuál querés saber el precio?";
    }

    // Detectar intención: productos disponibles
    if (/producto|tienes|tienen|hay|catalogo|catálogo|que venden|que venden/.test(msg)) {
      const productList = products.map(p => {
        const mayoreo = p.prices.find(pr => pr.channel === "MAYOREO");
        const menudeo = p.prices.find(pr => pr.channel === "MENUDEO");
        const precioMenudeo = menudeo?.pricePerKg || menudeo?.priceUnit;
        return `• ${p.name}${p.scientific ? ` (${p.scientific})` : ""}${precioMenudeo ? ` - desde $${precioMenudeo}/${menudeo.unit}` : ""}`;
      }).join("\n");
      return `¡Claro! Este es nuestro catálogo disponible hoy:\n\n${productList}\n\n¿Te interesa alguno en particular? Te puedo dar más detalles o precios específicos. 🐟`;
    }

    // Detectar intención: horarios
    if (/horario|abierto|cerrado|atienden|hora|abren|cierran/.test(msg)) {
      const horarios = hours.map(h => `${h.day}: ${h.timeOpen} – ${h.timeClose}`).join("\n");
      return `Nuestros horarios de atención son:\n\n${horarios}\n\nEstamos en ${config?.streetAddress}, ${config?.city}, ${config?.state}. ¡Te esperamos! 🦐`;
    }

    // Detectar intención: ubicación/envíos
    if (/envio|envío|delivery|domicilio|entrega|donde|ubicacion|ubicación|direccion|dirección|cobertura/.test(msg)) {
      const primary = coverage.filter(z => z.type === "primary").map(z => z.name);
      const extended = coverage.filter(z => z.type === "extended").map(z => z.name);
      let response = `Hacemos entregas en:\n\n📍 **Zona primaria (mismo día):**\n${primary.join(", ")}\n\n`;
      response += `🚚 **Zona extendida (24-48 horas):**\n${extended.join(", ")}\n\n`;
      response += `Pedidos antes de las 11:00 AM se entregan el mismo día en zona metropolitana de Rosarito y Tijuana.`;
      return response;
    }

    // Detectar intención: WhatsApp/contacto
    if (/whatsapp|contacto|telefono|teléfono|llamar|hablar|contactar/.test(msg)) {
      return `Podés contactarnos por:\n\n📱 WhatsApp: ${config?.phoneDisplay}\n📞 Teléfono: ${config?.phoneDisplay}\n📧 Email: ${config?.email}\n\n¡Estamos para ayudarte! 🦐`;
    }

    // Detectar intención: mayoreo vs menudeo
    if (/mayoreo|menudeo|diferencia|cual conviene/.test(msg)) {
      return "Trabajamos con dos canales:\n\n📦 **Mayoreo**: Para restaurantes, pescaderías y hoteles. Mínimo 5 kg por producto. Precios especiales y entrega programada.\n\n🏠 **Menudeo**: Para hogares. Sin mínimo de compra. Entrega el mismo día.\n\n¿Para qué necesitás el producto? Te recomiendo la mejor opción. 🦐";
    }

    // Detectar intención: saludo
    if (/hola|buenos|buenas|que tal|saludos/.test(msg)) {
      return `¡Hola! 🦐 Soy el asistente virtual de ${config?.brandName}. Estoy para ayudarte con consultas sobre productos, precios, disponibilidad y entregas. ¿Qué necesitas saber?`;
    }

    // Detectar intención: agradecimiento
    if (/gracias|muchas gracias|perfecto|genial|excelente/.test(msg)) {
      return "¡De nada! Si tenés alguna otra consulta, no dudes en preguntar. Estamos para ayudarte. 🦐";
    }

    // Respuesta por defecto
    return `Soy el asistente virtual de ${config?.brandName}. Te puedo ayudar con:\n\n• Información de productos y precios\n• Horarios de atención\n• Zonas de entrega\n• Diferencia entre mayoreo y menudeo\n\n¿Qué te gustaría saber? También podés escribirnos por WhatsApp al (661) 612-3456 para atención personalizada. 🦐`;
  } catch (error) {
    console.error("Error en fallback:", error);
    return "Disculpa, tuve un problema técnico. Por favor escríbenos por WhatsApp al (661) 612-3456 y te atendemos al instante. 🦐";
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

    const prompt = `Eres el asistente de gestión de Mariscos Quiroa. El dueño del negocio abrió el panel y quiere un resumen rápido del estado actual.

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

    return completion.choices[0]?.message?.content?.trim() || generateFallbackAdminSummary(context);
  } catch (e: any) {
    console.error("Error en resumen admin:", e);
    return generateFallbackAdminSummary(context);
  }
}

/**
 * Genera un resumen del admin sin IA (fallback cuando Z.ai no está disponible).
 */
function generateFallbackAdminSummary(context: {
  todayOrders: number;
  weekOrders: number;
  monthRevenue: number;
  topProducts: Array<{ name: string; qty: number }>;
  pendingOrders: number;
}): string {
  let summary = "";

  if (context.pendingOrders > 0) {
    summary += `Hoy tienes ${context.pendingOrders} pedido${context.pendingOrders === 1 ? "" : "s"} pendiente${context.pendingOrders === 1 ? "" : "s"} de gestionar. `;
  }

  if (context.todayOrders > 0) {
    summary += `Recibiste ${context.todayOrders} pedido${context.todayOrders === 1 ? "" : "s"} hoy. `;
  }

  if (context.monthRevenue > 0) {
    summary += `Los ingresos del mes van en $${context.monthRevenue.toLocaleString("es-MX")} MXN. `;
  }

  if (context.topProducts.length > 0) {
    const top = context.topProducts[0];
    summary += `Tu producto más vendido es ${top.name} con ${top.qty} pedido${top.qty === 1 ? "" : "s"}. `;
  }

  if (context.pendingOrders > 0) {
    summary += "Te sugiero priorizar los pedidos pendientes para avanzarlos en el flujo.";
  } else if (context.todayOrders === 0) {
    summary += "No hay pedidos nuevos hoy. Es un buen momento para revisar el catálogo o actualizar contenido.";
  }

  return summary || "Todo en orden. Revisa los números abajo para más detalle.";
}
