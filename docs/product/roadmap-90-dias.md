# Roadmap 90 días — TallerFlow

## Fase 1 — MVP base operativo (Días 1–30)

**Objetivo:** reemplazar papel y WhatsApp desordenado por un flujo digital mínimo que permita operar una sucursal.

### Semana 1
- [ ] Setup del repositorio: Next.js + TypeScript + Prisma + CI
- [ ] Autenticación básica (login) con roles: admin, recepcionista, técnico
- [ ] CRUD de clientes
- [ ] CRUD de equipos vinculados a clientes

### Semana 2
- [ ] Crear órdenes de trabajo con estado inicial
- [ ] Flujo de estados: `RECEIVED → DIAGNOSING → AWAITING_APPROVAL → IN_REPAIR → READY → DELIVERED`
- [ ] Timeline de cambios de estado por orden

### Semana 3
- [ ] Registro de diagnóstico técnico
- [ ] Generación de cotización (mano de obra + repuestos)
- [ ] Link de aprobación para el cliente
- [ ] Cambio automático de estado al aprobar

### Semana 4
- [ ] Dashboard operativo básico (órdenes abiertas, pendientes de aprobación, listas)
- [ ] Pruebas con datos reales del taller
- [ ] Correcciones y ajustes

**Meta de la fase:** operar completamente 1 sucursal con el sistema.

---

## Fase 2 — Eficiencia y control (Días 31–60)

**Objetivo:** reducir retrasos operativos y aumentar la visibilidad de la rentabilidad.

- [ ] Módulo de inventario de repuestos (entradas/salidas, stock mínimo)
- [ ] Alertas de stock bajo
- [ ] Asignación de técnicos y vista de carga de trabajo
- [ ] Notificaciones automáticas al cliente por email/WhatsApp
- [ ] Reportes: tiempo promedio de reparación, tasa de aprobación, órdenes por técnico
- [ ] Adjuntar fotos al ingreso del equipo
- [ ] Mejoras de UX basadas en feedback real

**Meta de la fase:** reducir tiempos de espera y mejorar la rentabilidad visible.

---

## Fase 3 — Escala y preparación SaaS (Días 61–90)

**Objetivo:** dejar la base lista para crecimiento multi-sucursal y/o comercialización.

- [ ] Soporte multi-sucursal (estructura de datos y UI)
- [ ] Permisos avanzados por rol y sucursal
- [ ] Exportación de reportes en PDF/CSV
- [ ] Registro de auditoría de cambios
- [ ] Landing page + pricing (si se venderá como SaaS)
- [ ] Proceso de onboarding para nuevos talleres
- [ ] Documentación de API interna

**Meta de la fase:** versión "Pro" validada y lista para replicar en otros talleres.
