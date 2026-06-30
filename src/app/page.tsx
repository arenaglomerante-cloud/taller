import Link from "next/link";

const modules = [
  {
    href: "/clientes",
    title: "Clientes",
    description: "Ficha de clientes y su historial de equipos",
    icon: "👥",
  },
  {
    href: "/equipos",
    title: "Equipos",
    description: "Registro de electrodomésticos por cliente",
    icon: "🔧",
  },
  {
    href: "/ordenes",
    title: "Órdenes de Trabajo",
    description: "Estado y seguimiento de cada reparación",
    icon: "📋",
  },
  {
    href: "/cotizaciones",
    title: "Cotizaciones",
    description: "Presupuestos y aprobación del cliente",
    icon: "💰",
  },
  {
    href: "/inventario",
    title: "Inventario",
    description: "Stock de repuestos y movimientos",
    icon: "📦",
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Métricas y KPIs del taller",
    icon: "📊",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            🛠️ TallerFlow
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            Gestión integral para talleres de reparación de electrodomésticos
          </p>
        </div>

        {/* Módulos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-3xl">{mod.icon}</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {mod.title}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {mod.description}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-zinc-400">
          TallerFlow — en construcción 🚧
        </p>
      </div>
    </main>
  );
}
