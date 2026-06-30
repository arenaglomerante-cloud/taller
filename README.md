# TallerFlow 🛠️

App web para la gestión integral de talleres de reparación de electrodomésticos.

## Propósito

TallerFlow digitaliza las operaciones de un taller: recepción de equipos, órdenes de trabajo, cotizaciones, control de inventario de repuestos y métricas de desempeño. El objetivo es reemplazar el papel y los mensajes desordenados por un flujo claro que mejore la rentabilidad y la experiencia del cliente.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend / Backend | [Next.js 16](https://nextjs.org) + TypeScript (App Router) |
| ORM | [Prisma 7](https://www.prisma.io) |
| Base de datos | PostgreSQL |
| Estilos | Tailwind CSS 4 |
| Deploy | Vercel + Railway/Render |

## Estructura del proyecto

```
src/
  app/                  # Rutas y páginas (App Router)
  modules/
    customers/          # Lógica de clientes
    devices/            # Equipos por cliente
    work-orders/        # Órdenes de trabajo
    quotes/             # Cotizaciones y aprobación
    inventory/          # Repuestos y movimientos de stock
    dashboard/          # Métricas y KPIs
  components/           # Componentes reutilizables
  lib/                  # Utilidades, cliente Prisma, helpers
prisma/
  schema.prisma         # Modelos de datos
docs/
  product/              # Visión, roadmap
  tech/                 # Arquitectura, decisiones técnicas
```

## Configuración local

### Requisitos

- Node.js ≥ 20
- PostgreSQL (local o en la nube)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/arenaglomerante-cloud/taller.git
cd taller

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar tu DATABASE_URL

# 4. Generar el cliente Prisma
npm run db:generate

# 5. Aplicar migraciones
npm run db:migrate

# 6. Iniciar en modo desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Revisión de código con ESLint |
| `npm run db:generate` | Genera el cliente Prisma |
| `npm run db:migrate` | Aplica migraciones en desarrollo |
| `npm run db:studio` | Abre Prisma Studio |

## Roadmap resumido

| Fase | Período | Objetivo |
|------|---------|---------|
| 🚀 MVP base | Días 1–30 | CRUD clientes/equipos/órdenes, cotizaciones, dashboard básico |
| ⚙️ Eficiencia | Días 31–60 | Inventario, notificaciones automáticas, reportes |
| 📈 Escala | Días 61–90 | Multi-sucursal, permisos avanzados, base SaaS |

Ver detalles en [docs/product/roadmap-90-dias.md](docs/product/roadmap-90-dias.md).

## Licencia

Privado — todos los derechos reservados.
