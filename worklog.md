# Worklog — Mariscos El Jona (proyecto Logan piloto)

Proyecto: Plataforma digital integral para Mariscos El Jona (distribuidora de pescados y mariscos, Mazatlán, Sinaloa). Primer piloto vertical de Logan.

---

## Task ID: 0 (contexto y estrategia)

**Agente**: Super Z (main)
**Task**: Registrar el contexto estratégico del proyecto, acuerdos comerciales con el operador (developer/freelancer que está aprendiendo) y roadmap de fases.

### Perfil del operador
- Sin marca consolidada aún
- Sin licenciatura ni título formal en ingeniería
- Sin clientes ni portafolio previo
- Construyendo Logan en paralelo (github.com/appsmx/logan) como sistema operativo multi-agente para negocios

### Acuerdos de precios (precios arranque, no senior)
- Página completa (Fases 1-4): $25,000 – $40,000 MXN (punto dulce: $30,000 – $35,000)
- Setup Facebook: $800 – $2,000
- Setup Instagram: $500 – $1,500
- Paquete FB + IG: $1,200 – $3,000
- Mantenimiento web sin IA: $800 – $2,000/mes
- Mantenimiento web con IA: $1,500 – $3,500/mes
- Gestión Facebook: $1,000 – $2,500/mes
- Gestión Instagram: $1,200 – $3,000/mes
- Paquete todo integrado mensual: $3,500 – $7,000/mes (punto dulce: $4,500 – $5,500)

### Estrategia de escalada
- Clientes 1-3 (año 1): precios arranque, foco en portafolio
- Clientes 4-6 (mes 6-12): +25-30% sobre arranque
- Cliente 7+ (año 2): precios senior ($45,000-$80,000 página completa, $7,000-$14,000/mes mantenimiento)

### Costos de API en producción (los paga el cliente, no el operador)
- API LLM básico: $100-$300 MXN/mes (~300 consultas)
- API LLM medio: $400-$900 MXN/mes (~1,000-1,500 consultas) ← escenario Mariscos El Jona
- API LLM alto: $1,200-$2,500 MXN/mes (~3,000+ consultas)
- WhatsApp Business básico: $150-$400/mes
- WhatsApp Business medio: $500-$1,200/mes
- WhatsApp Business alto: $1,200-$3,000/mes

Excepción: para clientes chicos al arranque, "todo incluido" con 30-50% margen sobre costo API real.

### Logan — visión
Sistema operativo para negocios que orquesta agentes especializados por rol:
- Agente vendedor (atención al cliente, cotizaciones)
- Agente CM (contenido para FB/IG)
- Agente logístico (pedidos, inventario, notificaciones)
- Agente analista (reportes, alertas)
- Agente contador (facturación, conciliación)
- Agente post-venta (seguimiento, reseñas)

Cada agente se despierta por trigger, opera en su scope, pide aprobación al dueño cuando corresponde.

**Mariscos El Jona = piloto de Logan**. Lo que se construye aquí se documenta como plantilla vertical replicable a pescaderías, carnicerías, fruterías, rosticerías, etc.

### Puntos de venta para la presentación al cliente
Técnicos:
1. Sitio responsive (80% tráfico mariscos es móvil)
2. Identidad visual coordinada web + FB + IG
3. Catálogo interactivo filtrable
4. Doble canal mayoreo/menudeo
5. Botón flotante WhatsApp con mensaje pre-armado por producto
6. Panel administrativo autónomo
7. Sistema de cotizaciones 24/7
8. Agente IA
9. Ecosistema de marcas (Jona 1 + Jona 2)
10. SEO técnico (schema.org LocalBusiness + Product)
11. Performance (Lighthouse 90+)
12. Mapa embebido
13. Testimonios (prueba social)
14. FAQ estructurado
15. Sello Logan
16. Arquitectura escalable
17. Marca de autoría profesional

Beneficios de negocio:
1. Más ventas (captación digital)
2. Menos tiempo en gestión (panel automatiza)
3. Imagen de marca superior
4. Atención 24/7
5. Datos para decidir
6. Independencia tecnológica
7. Escalable a multi-sucursal
8. Inversión con ROI (2-3 clientes nuevos/mes lo paga)

### Entregables pendientes
- [x] Fase 0: Frontend informativo (aprobado por el cliente)
- [ ] Fase 1: Base de datos + panel admin (EN CURSO)
- [ ] Fase 2: Sistema de pedidos/cotizaciones
- [ ] Fase 3: Agente IA + WhatsApp Business
- [ ] Fase 4: Pulido, SEO, PWA, deploy
- [ ] Presentación de venta interactiva (al cierre de Fase 1)
- [ ] Setup Facebook + Instagram (con identidad coordinada)

### Stage Summary
- Fase 0 completada y aprobada (frontend informativo con 11 secciones)
- Sello Logan integrado al footer
- Acuerdos comerciales establecidos con el operador
- Estrategia de precios definida para arranque
- Visión Logan documentada como marco estratégico del proyecto
- Arranca Fase 1 a continuación

---

## Task ID: 1 (Fase 1 — Base de datos + Panel Admin)

**Agente**: Super Z (main)
**Task**: Implementar la Fase 1: esquema Prisma, NextAuth, APIs REST, panel admin completo, migración del frontend a datos dinámicos.

### Work Log:
- Definido esquema Prisma con 17 modelos: User, SiteConfig, BusinessHour, Category, Product, ProductPresentation, ProductPrice, Customer, Order, OrderItem, Testimonial, Faq, BrandEcosystemEntry, Differentiator, Stat, CoverageZone, ActivityLog
- Generadas migraciones a SQLite (db/custom.db)
- Configurado NextAuth con CredentialsProvider + JWT + bcryptjs
- Creado seed script (scripts/seed.ts) con todos los datos iniciales: 1 admin, 8 productos con presentaciones y precios, 3 testimonios, 5 FAQs, 4 diferenciadores, 4 stats, 2 marcas, 9 zonas cobertura, config del sitio
- Implementadas APIs REST:
  - /api/admin/products (GET, POST) + [id] (GET, PUT, DELETE)
  - /api/admin/orders (GET, POST) + [id] (GET, PUT, DELETE)
  - /api/admin/dashboard (GET con KPIs, pedidos por estado, top productos)
  - /api/admin/content (GET agregado)
  - /api/admin/content/{testimonials|faqs|stats|coverage}/[id] (PUT, DELETE) + route (POST)
  - /api/admin/site-config (GET, PUT)
  - /api/public/site, /api/public/products, /api/public/testimonials, /api/public/faqs, /api/public/brands, /api/public/coverage
  - /api/auth/[...nextauth]
- Construido panel admin /admin con:
  - Login (/admin/login) con LoginForm cliente
  - Layout protegido (route group (dashboard)) con AdminSidebar
  - Dashboard con KPIs (productos, pedidos, clientes, ingresos), pedidos por estado, pedidos recientes, top productos
  - /admin/productos: lista filtrable, editor modal completo (datos básicos, presentaciones, precios por canal, featured/active)
  - /admin/pedidos: bandeja con filtros por estado, modal de detalle con cambio de estado y links a WhatsApp/tel
  - /admin/contenido: CRUD in-line de testimonios, FAQs, stats, cobertura
  - /admin/configuracion: editor de SiteConfig (identidad, contacto, dirección, redes, imágenes)
- Migrado frontend público a datos dinámicos:
  - Creado hook use-api.ts (fetch genérico con loading/error)
  - Creado hook use-site-config.ts (carga config con fallback a site-data.ts)
  - Actualizados Navbar, Hero, ProductCatalog, SalesChannels, About, Coverage, Testimonials, BrandEcosystem, Faq, Location, Footer, WhatsAppFloat para leer de APIs
  - Mantenido fallback al site-data.ts estático si la API falla (resiliencia)
- Verificado con Agent Browser:
  - Sitio público renderiza con datos de la BD (8 productos cargados dinámicamente)
  - /admin redirige a /admin/login correctamente
  - Login funciona con admin@mariscoseljona.mx / admin123
  - Dashboard muestra KPIs y pedidos por estado
  - /admin/productos muestra los 8 productos con opciones de editar/eliminar/activar
  - /admin/pedidos muestra bandeja vacía con mensaje correcto
  - /admin/contenido muestra testimonios y FAQs cargados
  - /admin/configuracion muestra formulario con datos actuales
  - Lint limpio, sin errores en consola

### Stage Summary:
- Fase 1 completada y verificada end-to-end
- 17 modelos de datos en producción
- Panel admin funcional con 5 secciones (dashboard, productos, pedidos, contenido, configuración)
- Frontend público ahora lee 100% de la base de datos, con fallback estático para resiliencia
- Login: admin@mariscoseljona.mx / admin123
- Acceso: /admin (redirige a login si no autenticado)
- Lista para que el dueño del negocio gestione su catálogo, precios y contenido sin dependencia técnica

---

## Task ID: 2 (Fase 2 — Sistema de pedidos y cotizaciones)

**Agente**: Super Z (main)
**Task**: Implementar la Fase 2: carrito de cotización en el sitio público, formulario de cliente, envío a la base de datos + WhatsApp, integración con el panel admin.

### Work Log:
- Arreglado el login de NextAuth para que funcione en dominios de preview dinámicos (trustHost: true, cookies sameSite lax, eliminado NEXTAUTH_URL del .env)
- Creada API pública POST /api/public/orders que:
  - Genera código secuencial MEJ-2026-0001
  - Busca o crea cliente por teléfono único
  - Calcula subtotal y total automáticamente
  - Crea pedido con status NUEVO
  - Crea los OrderItem correspondientes
- Actualizada API GET /api/public/products para incluir dbId y prices
- Actualizado tipo Product en site-data.ts para incluir dbId y prices
- Creado hook use-cart.ts (Zustand con persistencia) con:
  - items, channel (MAYOREO/MENUDEO), isOpen
  - add, remove, updateQuantity, clear
  - openCart, closeCart, toggleCart
  - getSubtotal, getItemCount
  - Persistencia en localStorage (parcialize)
- Reescrito ProductCatalog con:
  - Switch de canal (Menudeo/Mayoreo) que cambia precios dinámicamente
  - Selector de presentación (Select de Radix) por producto
  - Selector de cantidad con +/− y mínimos
  - Precio visible según canal y presentación
  - Botón "Agregar · $XXX" que añade al carrito y muestra toast
  - Botón secundario "Preguntar por WhatsApp" para consultas directas
  - Si no hay precio configurado, el botón abre WhatsApp directo
- Creado CartDrawer (Sheet) con:
  - Lista de items con imagen, presentación, cantidad editable, subtotal
  - Subtotal total estimado
  - Formulario de cliente (nombre, teléfono, email, dirección, ciudad, notas)
  - Botón "Enviar cotización ($XXX)" que POSTea a /api/public/orders
  - Pantalla de éxito con código de pedido (MEJ-2026-0001) y botón "Enviar por WhatsApp" con mensaje pre-armado
  - Estado vacío con CTA al catálogo
- Creado CartButton (botón flotante) que aparece cuando hay items, con badge de cantidad
- Actualizado WhatsAppFloat para no solaparse con CartButton
- Integrado todo en page.tsx
- Arreglado bug: Customer.phone no tenía @unique → agregado al esquema, db:push ejecutado
- Arreglado bug: channel del useCart venía en MAYÚSCULAS pero los prices de la API en minúsculas → normalizado en ProductCard
- Verificado end-to-end con Agent Browser:
  - Login funciona en dominio de preview
  - Catálogo muestra precios reales desde la BD
  - Switch mayoreo/menudeo cambia precios correctamente
  - Agregar al carrito abre el drawer automáticamente
  - Formulario de cliente se llena
  - Enviar cotización crea pedido en la BD (POST 201)
  - Pantalla de éxito muestra código MEJ-2026-0001
  - Panel admin /admin/pedidos muestra el pedido nuevo de "María González"
  - Dashboard actualiza "Pedidos nuevos" a 1
  - Lint limpio, sin errores

### Stage Summary:
- Fase 2 completada y verificada end-to-end
- Flujo completo: cliente arma cotización → se guarda en BD → aparece en panel admin → cliente puede enviar por WhatsApp con mensaje pre-armado
- Carrito persistente en localStorage (sobrevive recarga)
- 1 pedido de prueba creado: MEJ-2026-0001 de María González (Camarón + Pulpo, $1,010 MXN)
- Panel admin muestra el pedido en bandeja con estado NUEVO
- Lista para Fase 3 (agente IA + WhatsApp Business)

---

## Task ID: 3 (Fase 3 — Agente de IA + WhatsApp Business)

**Agente**: Super Z (main)
**Task**: Implementar la Fase 3: agente de IA conversacional en el sitio público (GLM vía Z.ai SDK) + asistente de gestión para el panel admin.

### Work Log:
- Creado servicio central /src/lib/ai-agent.ts con:
  - getZAI(): singleton del SDK de Z.ai (GLM)
  - buildBusinessContext(): genera contexto dinámico desde la BD (config del sitio, catálogo con precios, horarios, cobertura)
  - AGENT_SYSTEM_PROMPT: prompt especializado en mariscos, tono sinaloense cercano, reglas de escalamiento, prohibición de inventar precios
  - processCustomerMessage(): procesa mensaje del cliente con historial, detecta escalamiento a humano, detecta acciones sugeridas (abrir carrito, WhatsApp)
  - generateAdminSummary(): genera resumen ejecutivo accionable para el dueño
- Creada API /api/chat (POST pública) con:
  - Validación de input (mensaje requerido, máx 1000 chars)
  - Limpieza de historial (máx 20 mensajes, contenido limitado a 1000 chars)
  - Manejo de errores con fallback a WhatsApp
- Creada API /api/admin/ai-summary (GET autenticada) que:
  - Recopila métricas (pedidos hoy/semana/mes, ingresos, pendientes, top productos)
  - Llama a generateAdminSummary con esos datos
  - Devuelve resumen + stats
- Creado ChatWidget (/src/components/site/ChatWidget.tsx):
  - Botón flotante esquina inferior izquierda (separado de WhatsApp y carrito)
  - Ventana de chat con header (avatar con indicador online), área de mensajes, input, footer
  - Saludo inicial al abrir por primera vez
  - Indicador de "escribiendo..." con animación de puntos
  - Sugerencias de preguntas frecuentes cuando hay pocos mensajes
  - Acciones inline en respuestas (botones "Ver carrito", "WhatsApp")
  - Timestamps en cada mensaje
  - Badge de no leídos cuando el chat está cerrado
  - Indicador "online" verde en el botón
- Creado resumen IA en el dashboard admin (/admin):
  - Tarjeta destacada con gradiente ocean-amber
  - Botón "Generar resumen" que dispara la llamada a /api/admin/ai-summary
  - Estado de carga con skeleton
  - Estado de error con mensaje
  - Muestra el resumen en texto plano
  - Botón "Actualizar" para regenerar
- Integrado ChatWidget en page.tsx
- Verificado end-to-end con Agent Browser:
  - Chat widget abre correctamente
  - Saludo inicial aparece
  - Sugerencias de preguntas frecuentes visibles
  - Mensaje del cliente se envía
  - Agente responde con datos reales del catálogo (precios exactos del camarón: $220/kg mayoreo, $280/kg menudeo, etc.)
  - Tono sinaloense correcto (usa "vos", emojis moderados)
  - Tiempo de respuesta: 3-4 segundos
  - Resumen IA del admin funciona:
    * Identificó el pedido pendiente de María González
    * Reconoció Pulpo y Camarón como top productos
    * Notó que ingresos son $0 (porque el pedido está NUEVO, no confirmado)
    * Sugirió acción concreta: priorizar el pedido pendiente
    * Tono cercano, tratando al dueño de "vos"
  - Lint limpio, sin errores en consola

### Stage Summary:
- Fase 3 completada y verificada end-to-end
- Agente IA conversacional funcional en el sitio público (GLM vía Z.ai SDK)
- Contexto dinámico: el agente lee catálogo, precios, horarios y cobertura desde la BD en cada consulta
- Asistente de gestión IA en el panel admin (botón "Generar resumen" en dashboard)
- Detección de escalamiento a humano (derivación a WhatsApp)
- Acciones inline en respuestas del chat (abrir carrito, WhatsApp)
- Prompt engineering especializado en mariscos y tono sinaloense
- Manejo de errores robusto con fallback a WhatsApp
- Pendiente: WhatsApp Business API oficial (requiere cuenta Meta verificada del cliente — se gestiona aparte)
