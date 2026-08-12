# 🦐 Mariscos Quiroa — Plataforma Digital Integral

Distribuidora de pescados y mariscos frescos en Rosarito, Baja California. Plataforma digital completa con sitio web, panel administrativo, agente de IA y sistema de cotizaciones.

**Primer piloto de [Logan](https://github.com/appsmx/logan)** — sistema operativo multi-agente para negocios.

---

## 📋 Tabla de contenidos

- [Stack tecnológico](#-stack-tecnológico)
- [Características principales](#-características-principales)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación local](#-instalación-local)
- [Scripts disponibles](#-scripts-disponibles)
- [Credenciales por defecto](#-credenciales-por-defecto)
- [Configuración de producción](#-configuración-de-producción)
- [Documentación adicional](#-documentación-adicional)

---

## 🛠 Stack tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4 + shadcn/ui (New York)
- **Base de datos**: Prisma ORM + SQLite
- **Autenticación**: NextAuth.js v4 (Credentials Provider)
- **IA**: Z.ai SDK (GLM-4.6 agentico)
- **Iconos**: Lucide React
- **State**: Zustand (carrito) + TanStack Query
- **Fonts**: Playfair Display (display) + Geist (sans)

---

## ✨ Características principales

### Sitio público (`/`)
- Hero con stats del negocio
- Catálogo interactivo con 8 productos filtrables
- Switch mayoreo/menudeo con precios dinámicos
- Sistema de carrito de cotización (persistente en localStorage)
- Botón flotante de WhatsApp con mensaje pre-armado
- Sección "Nosotros" con timeline (2008 → 2024)
- Mapa de cobertura de Baja California
- Testimonios
- Ecosistema de marcas (Quiroa 1 + Quiroa 2)
- FAQ acordeón
- Ubicación con mapa OpenStreetMap embebido
- SEO técnico: schema.org LocalBusiness + FAQPage, sitemap.xml, robots.txt
- PWA instalable como app

### Agente IA conversacional
- Chat widget flotante (esquina inferior izquierda)
- Contexto dinámico desde la base de datos (catálogo, precios, horarios)
- Prompt especializado en mariscos y tono mexicano
- Escalamiento a humano cuando no puede responder
- Acciones inline: "Ver carrito", "WhatsApp"

### Sistema de cotizaciones
- Cliente arma pedido en el sitio
- Genera código único (MEJ-2026-0001)
- Se guarda en base de datos
- Se envía por WhatsApp con mensaje pre-armado
- Auto-creación de clientes

### Panel admin (`/admin`)
- Login con NextAuth (email + contraseña)
- **Dashboard**: KPIs, pedidos por estado, pedidos recientes, top productos
- **Productos**: CRUD completo con presentaciones y precios por canal
- **Pedidos**: Bandeja con filtros, búsqueda, paginación, export CSV
- **Contenido**: CRUD de testimonios, FAQs, stats, zonas de cobertura
- **Configuración**: Editar identidad, contacto, dirección, redes, imágenes
- **Asistente IA**: Botón "Generar resumen" que analiza el estado del negocio

### Robustez
- Manejo de errores graceful (fallback a datos estáticos)
- Try-catch en autenticación (cookies corruptas no rompen el sitio)
- Base de datos relacional con 17 modelos
- Arquitectura escalable a multi-sucursal

---

## 📁 Estructura del proyecto

```
mariscosquiroa/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Layout raíz con metadata + schemas
│   │   ├── page.tsx                  # Página principal (sitio público)
│   │   ├── globals.css               # Estilos globales + paleta
│   │   ├── not-found.tsx             # Página 404 personalizada
│   │   ├── error.tsx                 # Error boundary
│   │   ├── robots.ts                 # robots.txt dinámico
│   │   ├── sitemap.ts                # sitemap.xml dinámico
│   │   ├── admin/                    # Panel administrativo
│   │   │   ├── login/                # Página de login
│   │   │   └── (dashboard)/          # Layout protegido + 5 secciones
│   │   └── api/                      # APIs REST
│   │       ├── auth/[...nextauth]/   # NextAuth
│   │       ├── chat/                 # Endpoint del agente IA
│   │       ├── public/               # APIs públicas (site, products, etc.)
│   │       └── admin/                # APIs admin (CRUD de todo)
│   ├── components/
│   │   ├── site/                     # Componentes del sitio público
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ProductCatalog.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── WhatsAppFloat.tsx
│   │   │   └── ... (11 componentes)
│   │   ├── admin/                    # Componentes del panel admin
│   │   ├── seo/                      # Schemas JSON-LD
│   │   └── ui/                       # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts                     # Cliente Prisma
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── admin.ts                  # Helpers admin (requireAdmin, etc.)
│   │   ├── ai-agent.ts               # Servicio del agente IA (GLM)
│   │   ├── site-data.ts              # Datos estáticos (fallback)
│   │   └── utils.ts                  # Utilidades (cn, etc.)
│   └── hooks/
│       ├── use-api.ts                # Fetch genérico con loading/error
│       ├── use-site-config.ts        # Hook para config del sitio
│       └── use-cart.ts               # Hook del carrito (Zustand)
├── prisma/
│   └── schema.prisma                 # 17 modelos de datos
├── public/                           # Logo SVGs, manifest.json
├── scripts/
│   ├── seed.ts                       # Seed inicial
│   └── reseed.ts                     # Reseed (limpia + siembra)
├── download/                         # Entregables HTML standalone
│   ├── presentacion-mariscos-el-jona-v2.html
│   ├── mariscos-el-jona-preview.html
│   ├── mariscos-el-jona-admin-preview.html
│   └── CONTEXTO_LOGAN_MARISCOS_EL_JONA.md
├── .env.example                      # Template de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Instalación local

### Prerrequisitos

- Node.js 18+ o Bun
- Git

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/appsmx/mariscosquiroa.git
cd mariscosquiroa

# 2. Instalar dependencias
bun install
# o: npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y completar NEXTAUTH_SECRET con: openssl rand -hex 32

# 4. Crear base de datos y sembrar datos iniciales
bun run db:push
bun run scripts/reseed.ts

# 5. Iniciar servidor de desarrollo
bun run dev
```

El sitio se abre en `http://localhost:3000`
El panel admin en `http://localhost:3000/admin`

---

## 📜 Scripts disponibles

| Script | Descripción |
|---|---|
| `bun run dev` | Servidor de desarrollo (puerto 3000) |
| `bun run lint` | Verificar código con ESLint |
| `bun run build` | Build de producción |
| `bun run db:push` | Sincronizar esquema Prisma con SQLite |
| `bun run db:generate` | Regenerar Prisma Client |
| `bun run scripts/reseed.ts` | Limpiar BD y sembrar datos iniciales |

---

## 🔐 Credenciales por defecto

Después de ejecutar el seed, el usuario admin es:

- **Email**: `admin@mariscosquiroa.com`
- **Contraseña**: `admin123`

⚠️ **En producción**: cambiar la contraseña desde el panel o con un script de bcrypt.

---

## 🌐 Configuración de producción

### Variables de entorno para producción

```env
DATABASE_URL="file:/ruta/a/db/produccion.db"
NEXTAUTH_SECRET="genera-uno-nuevo-con-openssl-rand-hex-32"
NEXTAUTH_URL="https://mariscosquiroa.com"
```

### Deploy en Vercel (recomendado)

1. Conectá el repo a Vercel
2. Configurá las variables de entorno en el dashboard
3. Para la base de datos SQLite, recomendamos migrar a PostgreSQL (PlanetScale, Neon, etc.) — el esquema Prisma solo necesita cambiar `provider = "sqlite"` a `provider = "postgresql"`

### Dominio

Apuntá `mariscosquiroa.com` a Vercel (DNS A record o CNAME).

---

## 📚 Documentación adicional

- **Contexto del proyecto**: `download/CONTEXTO_LOGAN_MARISCOS_EL_JONA.md`
- **Presentación de venta**: `download/presentacion-mariscos-el-jona-v2.html`
- **Sitio estático (demo offline)**: `download/mariscos-el-jona-preview.html`
- **Panel admin estático (demo offline)**: `download/mariscos-el-jona-admin-preview.html`

---

## 🎨 Identidad visual

- **Paleta primaria**: Océano teal (`#0d9488` → `#0c4a6e`)
- **Paleta acento**: Ámbar dorado (`#d97706` → `#f59e0b`)
- **Tipografía display**: Playfair Display
- **Tipografía sans**: Geist (Inter)
- **Tono de voz**: Español mexicano, cercano, profesional

---

## 🤖 Sobre Logan

Este proyecto es el **primer piloto de Logan**, un sistema operativo multi-agente para negocios. La arquitectura y los prompts del agente IA están diseñados para ser replicables en otros giros de negocio (carnicerías, fruterías, rosticerías, etc.).

Más info: [github.com/appsmx/logan](https://github.com/appsmx/logan)

---

## 📄 Licencia

Propietario. Todos los derechos reservados © Mariscos Quiroa.

---

**Creado con [Logan](https://github.com/appsmx/logan)** — metodología de desarrollo multi-agente.
