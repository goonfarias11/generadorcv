# Estado del MVP — Digital Product Factory

Fecha: 9 de febrero de 2026

## Resumen ejecutivo
MVP operativo con arquitectura modular, ProductSpec como entidad central y flujos de catálogo + pedido inteligente. Se genera una spec normalizada, blueprint determinístico y se expone preview base.

## Alcance implementado

### Arquitectura y estructura
- Next.js App Router + TypeScript + Tailwind
- Separación por capas: app, modules, domain, services, lib
- Design system cerrado con selección determinística

### Entidad central
- ProductSpec con validaciones y reglas base
- Límite de secciones y normalización de datos

### Catálogo premium
- Lista de productos predefinidos
- Generación automática de ProductSpec

### Pedido inteligente
- Interpretación básica con extracción de intención
- Normalización y límites del MVP

### Intérprete
- Unificación de ambos flujos
- Salidas: accepted, reformulated, rejected

### Product Engine + Generador
- Blueprint determinístico
- Landing básica con copy coherente por objetivo

### API Routes
- /api/catalog
- /api/interpret

### Preview
- Home con flujo de catálogo y pedido inteligente
- Preview por spec id

### Prisma
- Prisma instalado
- Cliente configurado

## Estado actual
- MVP funcional para landings
- Preview base disponible
- Sin persistencia todavía

## Limitaciones vigentes
- No micro‑SaaS ni dashboards
- Preview aún sin render completo de componentes
- Sin almacenamiento persistente de specs

## Próximos pasos sugeridos
1) Render real de preview con componentes del design system
2) Persistencia de ProductSpec con Prisma
3) Reglas de negocio más estrictas en intérprete

## Comandos
- npm run dev
