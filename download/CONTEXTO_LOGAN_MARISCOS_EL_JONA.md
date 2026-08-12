# DOCUMENTO MAESTRO DE CONTEXTO
# Logan + Mariscos Quiroa

> **Cómo usar este documento**: Al iniciar una nueva conversación con cualquier IA (ChatGPT, Claude, GLM, etc.), copia y pega TODO el contenido de este archivo como primer mensaje, o adjúntalo como archivo. La IA entrará instantáneamente en contexto completo sobre Logan, el proyecto Mariscos Quiroa, los servicios que ofreces y los precios sugeridos.

---

## PARTE 1: CONTEXTO DE LOGAN

### Qué es Logan
Logan (github.com/appsmx/logan) es un **sistema operativo para negocios** que el operador (tú) está creando. Su propuesta: en lugar de "un chatbot que hace todo", es un **equipo de agentes virtuales especializados por rol** que operan coordinadamente.

### Arquitectura de Logan (multi-agente)
- **Agente vendedor** → atiende clientes, genera cotizaciones
- **Agente community manager** → genera y calendariza contenido para FB/IG
- **Agente logístico** → gestiona pedidos, inventario, notificaciones
- **Agente analista** → reportes, alertas de reposición, clientes inactivos
- **Agente contador** → facturación, conciliación, recordatorios de pago
- **Agente post-venta** → seguimiento, reseñas, fidelización

Cada agente se "despierta" por un trigger (mensaje entrante, fecha, evento de inventario), opera en su scope, y pide aprobación al dueño cuando corresponde.

### Mariscos Quiroa = PRIMER PILOTO DE LOGAN
Lo que se construyó para Mariscos Quiroa es la primera implementación vertical de Logan. Se documentó como plantilla replicable a otros giros (pescaderías, carnicerías, fruterías, rosticerías, etc.).

---

## PARTE 2: PROYECTO MARISCOS QUIROA — QUÉ SE CONSTRUYÓ

### El cliente
- **Negocio**: Mariscos Quiroa — distribuidora de pescados y mariscos frescos
- **Ubicación**: Rosarito, Baja California, México
- **Antigüedad**: 17 años de trayectoria (fundado 2008)
- **Modelo**: Mayoreo (restaurantes, pescaderías, hoteles) y menudeo (hogares)
- **Productos**: Pulpo, camarón, calamar, callo de hacha, almejas, ostiones, pescados frescos, especialidades (ceviches, mariscadas)
- **Cobertura**: Rosarito, Tijuana, Ensenada, Mexicali, San Quintín (Baja California)
- **Ecosistema**: 2 restaurantes hermanos (Quiroa 1 y Quiroa 2)

### Stack técnico utilizado
- **Framework**: Next.js 16 con App Router + TypeScript
- **Base de datos**: Prisma ORM con SQLite
- **Autenticación**: NextAuth.js v4
- **IA**: Z.ai SDK (modelo GLM) — ya integrado en el proyecto
- **UI**: Tailwind CSS 4 + shadcn/ui + Lucide Icons
- **Fuentes**: Playfair Display (títulos) + Geist (cuerpo)
- **Paleta**: Océano teal (#0d9488) + Ámbar (#d97706) + arenas

### Lo que se entregó (4 fases completas)

#### FASE 0 — Frontend informativo (completada)
- 11 secciones: Hero, Diferenciadores, Catálogo, Mayoreo/Menudeo, Nosotros, Cobertura, Testimonios, Ecosistema de marcas, FAQ, Ubicación, Footer
- Identidad visual coordinada (web + FB + IG)
- Sello Logan al pie de página
- Diseño responsive (móvil + desktop)
- Botones flotantes: WhatsApp + Carrito + Chat IA

#### FASE 1 — Base de datos + Panel admin (completada)
- **17 modelos de datos**: User, SiteConfig, BusinessHour, Category, Product, ProductPresentation, ProductPrice, Customer, Order, OrderItem, Testimonial, Faq, BrandEcosystemEntry, Differentiator, Stat, CoverageZone, ActivityLog
- **NextAuth configurado** (login con email/contraseña + JWT + bcrypt)
- **APIs REST** (públicas y admin) para CRUD de cada entidad
- **Panel admin /admin** con 5 secciones:
  - Dashboard: KPIs (productos activos, pedidos nuevos, clientes, ingresos del mes), pedidos por estado, pedidos recientes, productos más vendidos
  - Productos: lista filtrable, editor modal completo (datos básicos, presentaciones múltiples, precios por canal mayoreo/menudeo, activar/desactivar, destacar)
  - Pedidos: bandeja con filtros, buscador, paginación, export CSV, modal de detalle con cambio de estado y links directos a WhatsApp/teléfono del cliente
  - Contenido: CRUD inline de testimonios, FAQs, stats, zonas de cobertura
  - Configuración: editor completo de SiteConfig (identidad, contacto, dirección, redes, imágenes)
- **Login**: admin@mariscosquiroa.com / admin123

#### FASE 2 — Sistema de cotizaciones (completada)
- **API pública POST /api/public/orders** que crea pedidos desde la web
- **Carrito de cotización** con Zustand + persistencia en localStorage
- **Catálogo interactivo** con:
  - Switch Mayoreo/Menudeo que cambia precios dinámicamente
  - Selector de presentación por producto
  - Selector de cantidad con mínimos
  - Precio visible según canal y presentación
  - Botón "Agregar · $XXX" con toast de confirmación
- **Drawer del carrito** con lista de items, formulario de cliente, envío a BD + WhatsApp con mensaje pre-armado
- **Códigos secuenciales** de pedido (MEJ-2026-0001, etc.)
- **Auto-creación de clientes** por teléfono único
- **Pantalla de éxito** con código de seguimiento y botón "Enviar por WhatsApp"

#### FASE 3 — Agente de IA (completada)
- **Servicio central /src/lib/ai-agent.ts** con:
  - Contexto dinámico: lee catálogo, precios, horarios y cobertura desde la BD en cada consulta
  - Prompt especializado en mariscos, español mexicano (sin voseo), tono cercano
  - Detección de escalamiento a humano
  - Acciones sugeridas (abrir carrito, WhatsApp)
  - Memoria de conversación (últimos 10 mensajes)
- **API /api/chat** pública
- **Widget de chat flotante** con:
  - Botón con indicador "online" verde
  - Saludo inicial automático
  - Sugerencias de preguntas frecuentes
  - Indicador de "escribiendo..."
  - Acciones inline en respuestas
  - Badge de no leídos
- **Asistente de gestión IA en el panel admin**:
  - Botón "Generar resumen" en dashboard
  - Analiza pedidos hoy/semana/mes, ingresos, pendientes, top productos
  - Devuelve resumen accionable en lenguaje natural

#### FASE 4 — Pulido final (completada)
- **SEO técnico**:
  - robots.ts dinámico
  - sitemap.ts con 7 URLs priorizadas
  - Schema.org JSON-LD: LocalBusiness + FAQPage
  - Open Graph completo con imagen 1200×630
  - Twitter Card
  - themeColor para navegador móvil
- **PWA**: manifest.json, instalable como app
- **Páginas de error**: 404 personalizada ("Esta página se fue al mar") + error boundary genérico
- **Panel pedidos mejorado**: buscador en tiempo real, paginación, export CSV
- **Bug crítico arreglado**: login admin en dominios de preview dinámicos (NEXTAUTH_SECRET hex + try-catch en getServerSession)

---

## PARTE 3: SERVICIOS QUE OFRECES

### Servicios de creación (pago único)

#### 1. Página web completa (Fases 0-4)
- Frontend informativo profesional
- Panel administrativo autónomo
- Sistema de cotizaciones con WhatsApp
- Agente de IA conversacional
- Asistente de gestión IA para el dueño
- SEO técnico + PWA
- Manejo de errores profesional

#### 2. Setup de Facebook + Instagram
- Creación de cuentas con identidad coordinada a la web
- Paleta y tipografía idénticas (océano + ámbar, Playfair + Geist)
- Optimización de perfil (bio, link en bio, highlights)
- Carga inicial de 5-9 posts con grid coherente
- Configuración de WhatsApp Business link
- Kit de plantillas editables (Canva/Figma) para que el cliente genere posts futuros

#### 3. Campaña de marketing de lanzamiento
- **Incluye**: 1 video publicitario de 30-60s (reel/TikTok format)
- Calendario editorial del primer mes (8-12 posts FB + IG)
- Estrategia de hashtags para el giro marisquero en Baja California
- Copywriting con tono mexicano (no voseo)
- 2-3 reels con guion + sugerencias de imagen
- Configuración de Meta Business Suite para programación

### Servicios recurrentes (pago mensual)

#### 4. Mantenimiento web (sin IA)
- Updates de software (Next.js, dependencias, seguridad)
- Backups diarios de la base de datos
- Cambios menores de contenido (precios, productos, textos)
- Monitoreo de uptime
- 1-2 horas de soporte al mes
- Reporte mensual de performance

#### 5. Mantenimiento web (con IA)
- Todo lo anterior
- Ajustes del agente IA (prompt tuning, nuevas intenciones)
- Costo de la API del modelo LLM (GLM/Z.ai)
- Reportes de conversión del chatbot
- Sugerencias de mejora basadas en conversaciones reales

#### 6. Gestión de redes sociales (FB + IG)
- 8-12 posts/mes coordinados entre ambas redes
- 12-15 stories/mes
- 2-3 reels/mes
- Respuestas a mensajes y comentarios
- Gestión de reseñas
- Reporte mensual de engagement y crecimiento

---

## PARTE 4: VALOR DE CADA HERRAMIENTA

> Esta es la tabla que le muestras al cliente para justificar el precio. Cada herramienta tiene un "valor equivalente de mercado" — lo que costaría contratarla por separado.

| Herramienta | Qué hace | Valor de mercado | Tu precio arranque |
|---|---|---|---|
| **Sitio web responsive** (frontend) | Landing profesional con 11 secciones | $8,000 - $15,000 | $4,000 - $7,000 |
| **Panel admin autónomo** | El cliente gestiona todo sin depender de dev | $12,000 - $18,000 | $6,000 - $10,000 |
| **Sistema de cotizaciones** | Captación de leads 24/7 + WhatsApp + BD | $10,000 - $15,000 | $5,000 - $8,000 |
| **Agente IA conversacional** | Atención al cliente 24/7 sin personal | $15,000 - $25,000 | $8,000 - $14,000 |
| **Asistente de gestión IA** | Resúmenes inteligentes para el dueño | $5,000 - $10,000 | $2,500 - $5,000 |
| **SEO técnico + Schema.org** | Google te encuentra mejor | $3,000 - $8,000 | $1,500 - $3,500 |
| **PWA instalable** | App instalable en móvil sin app store | $2,000 - $5,000 | $1,000 - $2,500 |
| **Setup Facebook + Instagram** | Cuentas con identidad coordinada | $2,500 - $6,000 | $1,200 - $3,000 |
| **Campaña marketing + video** | Lanzamiento con 1 video + 8-12 posts | $5,000 - $12,000 | $3,000 - $6,000 |
| **TOTAL CREACIÓN** | | **$62,500 - $114,000** | **$32,200 - $59,000** |

### Mantenimiento mensual

| Servicio | Valor mercado | Tu precio arranque |
|---|---|---|
| Mantenimiento web (sin IA) | $1,500 - $3,500/mes | $800 - $2,000/mes |
| Mantenimiento web (con IA) | $3,000 - $6,000/mes | $1,500 - $3,500/mes |
| Gestión FB + IG | $4,500 - $10,500/mes | $2,200 - $5,500/mes |
| **TOTAL MENSUAL (paquete)** | **$9,000 - $20,000/mes** | **$4,500 - $9,000/mes** |

---

## PARTE 5: PRECIOS RECOMENDADOS PARA TU SITUACIÓN

### Tu contexto
- Sin portafolio previo
- Sin título universitario
- Sin marca consolidada
- Pero: con IA como copiloto, lo que reduces de 4 horas a 5 minutos tareas de community management

### Paquete de lanzamiento (pago único contra entrega)

**Recomendación: $30,000 - $35,000 MXN** (todo incluido)

Desglose para presentar al cliente:
- Página web completa (4 fases): $22,000
- Setup Facebook + Instagram: $2,000
- Campaña de marketing + video publicitario: $4,000
- Capacitación al cliente (1 sesión): $1,000
- Buffer de imprevistos: $1,000 - $5,000
- **Total: $30,000 - $35,000**

**Estrategia de cobro**: 50% anticipo, 50% contra entrega. Hitos:
1. Anticipo 50% ($15,000-$17,500) al firmar
2. Entrega Fase 0-1 (frontend + panel): 25% ($7,500-$8,750)
3. Entrega Fase 2-3 (cotizaciones + IA): 15% ($4,500-$5,250)
4. Entrega Fase 4 + redes + marketing: 10% ($3,000-$3,500)

### Paquete mensual recurrente

**Recomendación: $5,500 - $6,500 MXN/mes**

Desglose:
- Mantenimiento web con IA: $2,000/mes
- Gestión FB + IG (8-12 posts + 2-3 reels + stories): $3,000/mes
- Reporte mensual: $500/mes
- **Total: $5,500/mes** (o $6,500 con más reels)

### Costos que paga el cliente por separado (no los absorbes tú)
- **API del modelo LLM** (chatbot): $300-$800 MXN/mes (según uso)
- **WhatsApp Business API** (cuando se habilite): $150-$400 MXN/mes
- **Dominio + hosting**: $500-$1,500 MXN/año
- **Meta Ads** (si hace publicidad pagada): presupuesto del cliente

### Justificación del precio para el cliente
> "El desarrollo completo de una plataforma digital como esta, en agencia profesional, cuesta entre $60,000 y $110,000 pesos. Mi propuesta es de $30,000-$35,000 porque estoy construyendo mi portafolio. El precio sube para los próximos clientes una vez que tu caso sea referencia. Lo que recibís: sitio web profesional con panel administrativo autónomo, sistema de cotizaciones automatizado, agente de IA que atiende 24/7, presencia coordinada en Facebook e Instagram, y campaña de lanzamiento con video publicitario. Todo esto vale objetivamente más de lo que cobro."

### ROI para el cliente (cómo venderlo)
- **2-3 clientes nuevos al mes** (que vengan de la web o redes) pagan toda la inversión inicial
- **El mantenimiento mensual recurrente** ($5,500) lo cubre con 1 sola venta de mayoreo por mes
- **El agente IA** atiende fuera de horario → captura ventas que antes se perdían
- **El panel admin** le ahorra 4-6 horas semanales de gestión manual
- **El sistema de cotizaciones** convierte visitas en leads medibles → ya no es "vino a la página y se fue"

---

## PARTE 6: ARGUMENTARIO DE VENTA

### Puntos técnicos (lo que el cliente recibe)
1. Sitio web profesional responsive (80% del tráfico marisquero es móvil)
2. Identidad visual coordinada web + FB + IG (no se ve como "negocio con página suelta")
3. Catálogo interactivo con precios por canal (mayoreo/menudeo)
4. Sistema de cotización con WhatsApp pre-armado (conversión directa)
5. Panel administrativo autónomo (el cliente gestiona solo, no depende de ti)
6. Agente IA 24/7 (nunca pierde una venta por horario)
7. Asistente de gestión IA (resúmenes inteligentes para tomar decisiones)
8. SEO técnico (Google lo encuentra cuando alguien busca "mariscos Rosarito")
9. PWA instalable como app (icono en el celular del cliente)
10. Sistema de pedidos con códigos de seguimiento (profesional como Mercado Libre)
11. Export de pedidos a CSV/Excel (para contabilidad)
12. Ecosistema de marcas (Quiroa 1 + Quiroa 2 como familia)
13. Mapa embebido (te encuentran fácil)
14. Testimonios (prueba social)
15. FAQ estructurado (reduce consultas repetitivas)
16. Manejo de errores profesional (404 on-brand)
17. Sello Logan (respaldo metodológico)
18. Arquitectura escalable (crece a multi-sucursal sin reescribir)
19. Video publicitario incluido (reel/TikTok)
20. 8-12 posts iniciales en FB + IG con grid coherente

### Beneficios de negocio (lo que al cliente le importa)
1. **Más ventas**: captación digital de clientes que antes no llegaban
2. **Menos tiempo en gestión**: el panel automatiza lo manual
3. **Imagen de marca superior**: compite con cadenas grandes
4. **Atención 24/7**: nunca pierde una venta por horario
5. **Datos para decidir**: reportes de qué producto vende más, cuándo, a quién
6. **Independencia tecnológica**: no depende de un sobrino que "sabe de computadoras"
7. **Escalable**: cuando abra Jona 3, el sistema ya lo soporta
8. **Inversión, no gasto**: el ROI se logra con 2-3 clientes nuevos al mes

### Objecciones comunes y cómo responderlas

**"Es muy caro"**
> "Entiendo. Comparalo con lo que cobran las agencias: $60,000-$110,000 por lo mismo. Mi precio es de lanzamiento porque estoy construyendo portafolio. Además, el retorno es rápido: 2-3 clientes nuevos al mes pagan toda la inversión."

**"No conozco al agente de IA, no sé si funciona"**
> "Te lo demuestro ahora mismo. Abrí el chat de la web y preguntale lo que quieras. Vas a ver que responde con los precios reales de tu catálogo, en español mexicano, y deriva a WhatsApp cuando no puede resolver."

**"¿Y si después no funcionás o desapareces?"**
> "Todo el código está documentado y usa tecnologías estándar (Next.js, Prisma, shadcn/ui). Cualquier desarrollador puede tomarlo. Pero mi interés es que funcione, porque tu caso de éxito me sirve para cobrar más al siguiente cliente."

**"¿Por qué no lo hago yo mismo con Wix/SquareSpace?"**
> "Wix te da una plantilla. Esto es una aplicación web con base de datos, agente de IA, panel administrativo y sistema de pedidos. Wix no tiene nada de eso. Lo que te entrego es nivel software profesional, no una plantilla editable."

**"¿Y los costos mensuales de APIs?"**
> "Los costos de IA y WhatsApp Business los pagás vos a Meta y al proveedor de IA directamente, a tu nombre. Yo te configuro todo. El costo real es $300-$800 pesos al mes según uso. Mis honorarios mensuales son por mi trabajo de mantenimiento y gestión, no por revender servicios."

---

## PARTE 7: CÓMO USAR ESTE DOCUMENTO

### Para iniciar una nueva conversación con IA
Copia y pega este archivo completo como primer mensaje. La IA tendrá todo el contexto.

### Prompts sugeridos después de pasar el contexto

**Para crear publicaciones de redes sociales**:
> "Basándote en el contexto de Mariscos Quiroa que te pasé, generame 3 publicaciones para Facebook: una anunciando llegada de pulpo fresco, una con tip de preparación de ceviche, y una promocionando mayoreo para restaurantes. Incluí caption + sugerencia de imagen + hashtags."

**Para ajustar precios**:
> "Tengo un cliente potencial en [giro] en [ciudad]. Basándote en los precios de arranque de Logan, ¿cuánto le cobrarías por [servicio]? El cliente tiene [características]."

**Para crear presentación de venta**:
> "Basándote en el contexto de Logan y Mariscos Quiroa, creame una presentación de venta interactiva en HTML que pueda mostrarle al cliente. Debe incluir los 20 puntos técnicos, los beneficios de negocio, la tabla de precios y el ROI estimado."

**Para generar contenido del video publicitario**:
> "Generame el guion completo de un video publicitario de 45 segundos para Mariscos Quiroa. Tono: cercano, mexicano, mostrando frescura y trayectoria. Estructura: hook → problema → solución → CTA."

### Archivos clave del proyecto (referencia)
- **Worklog completo**: `/home/z/my-project/worklog.md` — registro detallado de las 4 fases
- **Datos centrales editables**: `src/lib/site-data.ts` — toda la info del negocio
- **Prompt del agente IA**: `src/lib/ai-agent.ts` — cerebro del chatbot
- **Esquema de base de datos**: `prisma/schema.prisma` — 17 modelos
- **Seed script**: `scripts/seed.ts` y `scripts/reseed.ts` — datos iniciales

### Datos de acceso al panel admin (cuando esté en producción)
- **URL**: mariscosquiroa.com/admin (cuando tengas dominio real)
- **Email**: admin@mariscosquiroa.com
- **Contraseña**: admin123 (el cliente debe cambiarla)

---

## PARTE 8: ROADMAP FUTURO DE LOGAN

### Lo que viene para Logan como producto
1. **Plantillas verticales**: replicar Mariscos Quiroa para pescaderías, carnicerías, fruterías, rosticerías, tortillerías, etc.
2. **Agentes especializados**: implementar los 6 roles (vendedor, CM, logístico, analista, contador, post-venta)
3. **Panel multi-negocio**: un dashboard donde el operador gestiona todos sus clientes desde un solo lugar
4. **Marketplace de plantillas**: vender plantillas a otros desarrolladores
5. **SaaS subscription**: modelo de suscripción para negocios que quieran usar Logan sin implementación custom

### Precios objetivo (cuando tengas portafolio de 3+ casos)
- Página completa: $45,000 - $80,000 MXN
- Setup redes: $2,500 - $6,000
- Mantenimiento mensual: $7,000 - $14,000/mes
- Cada nueva plantilla vertical: $30,000 - $50,000 de implementación + $5,000-$9,000/mes recurrente

### Meta de clientes año 1
- 3-5 clientes activos con paquete integrado a $5,500-$6,500/mes
- Ingreso recurrente mensual: $16,500 - $32,500 MXN
- Ingresos por implementación: $90,000 - $175,000 MXN
- **Total año 1 proyectado: $250,000 - $500,000 MXN**

---

## RESUMEN EJECUTIVO (para cuando tengas poco tiempo)

**Quién eres**: Operador de Logan (github.com/appsmx/logan), sistema operativo multi-agente para negocios. Sin portafolio previo, construyendo primer piloto.

**Qué vendes**: Plataforma digital integral para negocios de alimentos = web + panel admin + IA + redes + marketing + mantenimiento.

**Primer cliente piloto**: Mariscos Quiroa (Playas de Rosarito, BC) — distribuidora de mariscos, 17 años de trayectoria, 2 restaurantes hermanos.

**Precio arranque**: $30,000-$35,000 MXN por todo (web + redes + marketing con video), pago 50/50 contra hitos.

**Mantenimiento mensual**: $5,500-$6,500 MXN/mes (web con IA + gestión FB/IG).

**Costos que paga el cliente aparte**: APIs ($300-$800/mes), hosting ($500-$1,500/año), Meta Ads (presupuesto del cliente).

**Tu diferencial**: Agente IA que atiende 24/7, panel autónomo, identidad visual coordinada, precios 50% abajo de agencia profesional, ROI en 2-3 clientes nuevos.

**Cómo usar este documento**: Copia y pega en nuevas conversaciones de IA para entrar en contexto instantáneamente.
