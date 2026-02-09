# Digital Product Factory (MVP)

Sistema de generación automática de productos digitales premium con arquitectura modular y reglas estrictas.

## Objetivo del MVP

- Recibir pedidos (catálogo o pedido inteligente)
- Traducir a ProductSpec normalizada
- Generar landing premium determinística
- Exponer un preview funcional

## Comandos básicos

```bash
npm run dev
```

## Estructura base

- app: UI y rutas API
- modules: catálogo, intérprete, engine, generator, preview, design system
- domain: entidades (ProductSpec)
- services/lib: utilidades e infraestructura

## Prisma

- DATABASE_URL en .env
- schema en prisma/schema.prisma
