# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.0] - 2025-11-25

### 🔒 Seguridad

#### CSP con Nonces (Content Security Policy)
- **Eliminado `'unsafe-inline'`** de `script-src` y `style-src` en CSP
- **Implementado sistema de nonces** dinámicos por request en middleware
- **Agregado `'strict-dynamic'`** para permitir scripts de confianza
- **Agregado `require-trusted-types-for 'script'`** para prevenir XSS mediante DOM sinks

#### Headers de Seguridad Adicionales
- **HSTS mejorado**: `max-age=63072000` (2 años) con `includeSubDomains` y `preload`
- **Cross-Origin-Opener-Policy**: `same-origin` para aislar contexto de navegación
- **Cross-Origin-Resource-Policy**: `same-origin` para controlar carga de recursos
- **X-Frame-Options**: `DENY` para prevenir clickjacking
- **X-Content-Type-Options**: `nosniff` para prevenir MIME sniffing

### ⚡ Rendimiento

#### Optimización de Recursos Críticos
- **Preload de CSS crítico**: `/_next/static/css/8c0d68663fae90d3.css`
- **Preconnect a recursos externos**: Google Fonts, MercadoPago API
- **DNS Prefetch**: Resolución anticipada de dominios externos
- **Dynamic Imports**: Code splitting en componentes grandes (TemplatesGallery, TestimonialsSection, ResumePreview, PlanSelection)

#### Mejoras de Bundle
- Reducción de bundle inicial: Landing de 120KB → 92.9KB
- Estados de carga para componentes dinámicos

### ♿ Accesibilidad

#### Contraste WCAG AA
- Corregido contraste de badges: `bg-green-500` → `bg-green-700` (ratio >4.5:1)
- Todos los elementos cumplen WCAG AA (mínimo 4.5:1 para texto normal)

#### Estructura Semántica
- Agregado landmark `<main>` en layout raíz
- Corregida jerarquía de headings: h1 → h2 → h3 (sin saltos)
- Un solo h1 por página

### 📊 SEO

#### Rich Results (JSON-LD)
- **Agregado Schema.org**: WebApplication con rating y pricing
- **Datos estructurados**: Organization, AggregateRating, Offer
- **Scripts de validación**: `validate-schema.ps1` y `validate-schema.sh`

### 🛠️ Herramientas

#### Nuevos Archivos
- `lib/nonce.js`: Generador de nonces criptográficamente seguros
- `lib/trustedTypes.js`: Configuración de Trusted Types con polyfill
- `scripts/validate-schema.ps1`: Validador de JSON-LD para Windows
- `scripts/validate-schema.sh`: Validador de JSON-LD para Unix/Linux

### 📝 Documentación
- Agregado CHANGELOG.md con historial completo
- Actualizado README.md con sección de seguridad y nonces
- Comentarios en código explicando CSP, HSTS, Trusted Types

### 🔧 Cambios Técnicos

#### Archivos Modificados
- `middleware.js`: Generación de nonces, CSP dinámico, headers adicionales
- `next.config.js`: Eliminado CSP estático (ahora en middleware)
- `app/layout.jsx`: Preloads, preconnects, JSON-LD
- `components/home/TemplatesGallery.jsx`: Contraste mejorado en badges
- `app/globals.css`: Contraste de badges success/warning

#### Lighthouse Scores (Objetivo)
- **Performance**: 100
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

---

## [1.0.0] - 2025-11-24

### ✨ Features Iniciales
- Generador de CV con 8 plantillas profesionales
- Exportación a PDF, DOCX, HTML, TXT, JSON, Imagen
- Sistema de scoring inteligente
- Plan PRO con MercadoPago
- Sugerencias con IA
- Diseño responsive y moderno

### 🎨 UI/UX
- Landing page con Hero, Benefits, How It Works, Templates, Testimonials
- Builder con preview en tiempo real
- Modal de preview mobile
- Selector de plantillas
- Sistema de progreso visual

### 🔐 Autenticación y Pagos
- Integración con MercadoPago
- Sistema de activación PRO
- Panel de administración
- Gestión de comprobantes
