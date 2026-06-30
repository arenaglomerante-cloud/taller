# Arquitectura técnica — TallerFlow

## Visión general

TallerFlow es una aplicación web **full-stack monolítica** basada en Next.js App Router. Toda la lógica vive en un único repositorio para maximizar la velocidad de desarrollo en la etapa inicial.

```
┌─────────────────────────────────────────────────────┐
│                   Navegador / PWA                   │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────┐
│              Next.js App (Vercel)                   │
│  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │  React UI    │  │   API Routes / Server Actions│  │
│  │  (App Router)│  │   (src/app/api/...)          │  │
│  └──────────────┘  └──────────────┬──────────────┘  │
└─────────────────────────────────── │ ───────────────┘
                                     │
┌────────────────────────────────────▼───────────────┐
│              Prisma ORM                            │
└────────────────────────────────────┬───────────────┘
                                     │
┌────────────────────────────────────▼───────────────┐
│              PostgreSQL (Railway / Render)          │
└────────────────────────────────────────────────────┘
```

## Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | Next.js 16 (App Router) | SSR, Server Actions, routing integrado |
| Lenguaje | TypeScript | Tipado estático, menos bugs |
| Estilos | Tailwind CSS 4 | Productividad, diseño consistente |
| ORM | Prisma 7 | Migraciones declarativas, tipos automáticos |
| Base de datos | PostgreSQL | Relaciones complejas, confiable |
| Autenticación | NextAuth (por agregar) | Sesiones, OAuth, JWT |
| CI/CD | GitHub Actions + Vercel | Deploy automático en cada PR |

## Estructura de módulos

Cada módulo en `src/modules/` agrupa toda la lógica relacionada con un dominio:

```
src/modules/<nombre>/
  components/    # Componentes React del módulo
  actions/       # Server Actions (mutaciones)
  queries/       # Funciones de lectura de datos
  types.ts       # Tipos TypeScript del dominio
  schema.ts      # Validaciones Zod (por agregar)
```

### Módulos actuales

| Módulo | Responsabilidad |
|--------|----------------|
| `customers` | CRUD de clientes, historial |
| `devices` | Equipos vinculados a clientes |
| `work-orders` | Órdenes, estados, timeline |
| `quotes` | Cotizaciones, aprobación |
| `inventory` | Partes, stock, movimientos |
| `dashboard` | Métricas agregadas, KPIs |

## Modelos de datos principales

```
User ──────────────┐
                   │ technician
Customer ──────────┼──── WorkOrder ──── Quote
    │              │         │
    └──── Device ──┘         └──── (usa repuestos)
                                        │
Part ──── InventoryMovement ────────────┘
```

## Convenciones

- **Server Actions** para todas las mutaciones (no fetch manual desde el cliente).
- **Server Components** por defecto; `"use client"` solo cuando se necesita interactividad.
- **Prisma Client** se instancia una sola vez en `src/lib/prisma.ts` (singleton).
- **Variables de entorno** se definen en `.env` y se documentan en `.env.example`.

## Decisiones técnicas

| Decisión | Motivo |
|---------|--------|
| Monorepo simple (no Turborepo) | Menor complejidad inicial; se puede migrar si crece |
| App Router (no Pages Router) | Soporte nativo de Server Components y Actions |
| Prisma sobre Drizzle | API más madura, mejor DX para el equipo |
| PostgreSQL sobre SQLite | Soporte de producción robusto desde el inicio |
