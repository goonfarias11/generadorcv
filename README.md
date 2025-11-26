# GeneradorCV - Proyecto Completo de Generador de CV

🚀 **Aplicación web moderna para crear currículums profesionales con IA, exportación múltiple y sistema PRO de monetización.**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Tests-Jest%20%2B%20Playwright-green)](https://playwright.dev/)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tech Stack](#tech-stack)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
- [Testing](#testing)
- [Deploy](#deploy)
- [Licencia](#licencia)

---

## ✨ Características

### 🎨 Generador de CV
- **8 plantillas profesionales** optimizadas para ATS
- **Vista en tiempo real** mientras editas
- **Score inteligente** con análisis de calidad
- **Autoguardado** automático en localStorage
- **Exportación múltiple**: PDF, PNG, DOCX, ZIP

### 💎 Sistema PRO
- **Monetización** con Stripe y Mercado Pago
- **Funciones premium**: más plantillas, personalización, sin marca de agua
- **Portal de gestión** de suscripciones
- **Webhooks** para activación automática

### 🌐 Internacionalización
- **3 idiomas**: Español, English, Português
- **Detección automática** del navegador
- **Selector de idioma** integrado

### 📝 Blog con MDX
- Sistema de blog dinámico con MDX
- Soporte para markdown enriquecido
- Categorías y etiquetas
- SEO optimizado por artículo

### 📊 Analytics
- **Panel de administración** con métricas
- Estadísticas de uso en tiempo real
- Análisis de conversión

### 🚀 Performance
- **Lighthouse score**: 90+ en todos los aspectos
- **Lazy loading** de componentes
- **Memoización** con React.memo
- **Optimización de imágenes** con Next.js Image

### 🎨 UX Mejorada
- **Animaciones fluidas** con framer-motion
- **Autoguardado visual** con indicador en tiempo real
- **Navegación lateral** con stepper de progreso
- **Vista previa en vivo** con debouncing (200ms)
- **Restauración de scroll** por sección
- **Transiciones suaves** entre pasos
- **ARIA labels** completos para accesibilidad
- **Contraste WCAG 2.1 AA** en todos los elementos
- **Loading states** mejorados para exportación

### 🔍 SEO
- **Metadata dinámica** por página
- **OG images** generados automáticamente
- **Sitemap.xml** dinámico
- **robots.txt** configurado

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **Zustand** (state management)
- **Framer Motion** (animations)

### Backend
- **Next.js API Routes**
- **Puppeteer** (PDF generation)
- **Stripe** & **Mercado Pago** (payments)

### Testing
- **Jest** (unit tests)
- **React Testing Library** (component tests)
- **Playwright** (E2E tests + visual regression)

### DevOps
- **Vercel** (deployment)
- **Lighthouse CI** (performance monitoring)
- **GitHub Actions** (CI/CD)

---

## 📦 Instalación

### Requisitos
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/generadorcv.git
cd generadorcv

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus claves

# 4. Iniciar en desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

---

## 📜 Scripts Disponibles

### Desarrollo
```bash
npm run dev              # Inicia servidor de desarrollo
npm run build            # Build de producción
npm run start            # Inicia servidor de producción
npm run lint             # Lint con ESLint
npm run format           # Formatear código con Prettier
```

### Testing
```bash
npm run test             # Tests unitarios
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
npm run test:e2e         # Tests E2E con Playwright
npm run test:visual      # Tests de regresión visual
npm run test:all         # Ejecutar todos los tests
npm run test:ci          # Tests para CI/CD
```

### Performance
```bash
npm run lighthouse       # Lighthouse CI
npm run lighthouse:local # Lighthouse en localhost
npm run analyze          # Analizar bundle size
```

### Deploy
```bash
npm run build:prod       # Build + Lighthouse
npm run deploy           # Deploy a Vercel (prod)
npm run deploy:preview   # Deploy a Vercel (preview)
```

---

## 📁 Estructura del Proyecto

```
generadorcv/
├── app/                          # Next.js App Router
│   ├── admin/                    # Panel de analytics
│   ├── api/                      # API Routes
│   │   ├── generate/             # Generar CV
│   │   ├── export-*/             # Exportaciones (PDF, PNG, DOCX, ZIP)
│   │   └── payments/             # Stripe + Mercado Pago
│   ├── blog/                     # Sistema de blog
│   ├── builder/                  # Constructor de CV
│   ├── pro/                      # Sistema PRO
│   ├── layout.jsx                # Layout global con metadata
│   └── page.jsx                  # Landing page
│
├── components/                   # Componentes reutilizables
│   └── LanguageSwitcher.jsx      # Selector de idiomas
│
├── content/                      # Contenido del blog (MDX)
│   └── blog/                     # Posts del blog
│
├── hooks/                        # Custom hooks
│   ├── useProStatus.js           # Estado PRO del usuario
│   └── useResumeOptimized.js     # Zustand optimizado
│
├── i18n/                         # Traducciones
│   ├── es.json                   # Español
│   ├── en.json                   # English
│   └── pt.json                   # Português
│
├── lib/                          # Utilidades
│   ├── blog.js                   # Funciones del blog
│   ├── helpers.js                # Helpers generales
│   ├── score.js                  # Score inteligente
│   ├── templates.js              # Plantillas de CV
│   ├── validation.js             # Validaciones
│   ├── puppeteer-config.js       # Config Puppeteer serverless
│   └── payments/                 # Lógica de pagos
│       ├── stripe.js
│       └── mercadopago.js
│
├── public/                       # Assets estáticos
│   ├── branding/                 # Logo, iconos, brand guidelines
│   ├── favicon.svg
│   └── robots.txt
│
├── store/                        # Zustand store
│   └── resumeStore.js            # Estado global del CV
│
├── tests/                        # Suite de tests
│   ├── unit/                     # Tests unitarios
│   ├── components/               # Tests de componentes
│   ├── integration/              # Tests de integración
│   ├── api/                      # Tests de API routes
│   ├── e2e/                      # Tests E2E
│   └── visual/                   # Tests de regresión visual
│
├── .env.local                    # Variables de entorno (local)
├── .prettierrc                   # Configuración Prettier
├── jest.config.js                # Configuración Jest
├── playwright.config.js          # Configuración Playwright
├── lighthouserc.js               # Configuración Lighthouse
├── middleware.js                 # Middleware de i18n
├── next.config.js                # Configuración Next.js
├── tailwind.config.js            # Configuración Tailwind
├── vercel.json                   # Configuración Vercel
│
└── README.md                     # Este archivo
```

---

## 📚 Documentación

- **[TESTING.md](./TESTING.md)**: Guía completa de testing
- **[MONETIZATION.md](./MONETIZATION.md)**: Sistema de pagos PRO
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Guía de deploy a producción
- **[BRAND_GUIDELINES.md](./public/branding/BRAND_GUIDELINES.md)**: Guía de branding

---

## 🧪 Testing

### Cobertura Actual

- **104 tests unitarios + integración**
- **14 snapshots visuales**
- **Cobertura**: 70%+ en funciones críticas

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Tests visuales
npm run test:visual

# Actualizar snapshots
npm run test:visual:update

# Todos los tests
npm run test:all
```

Ver [TESTING.md](./TESTING.md) para más detalles.

---

## 🚀 Deploy

### Deploy a Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
npm run deploy
```

### Deploy Manual

```bash
# 1. Build
npm run build

# 2. Start
npm run start
```

### Variables de Entorno

Asegúrate de configurar:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_URL=https://tu-dominio.com
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía completa.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

---

## 👥 Autores

- **Equipo GeneradorCV** - [Website](https://generadorcv.com)

---

## 🙏 Agradecimientos

- Next.js team
- Vercel
- Stripe
- Mercado Pago
- Comunidad open source

---

## 📧 Contacto

- Website: [https://generadorcv.com](https://generadorcv.com)
- Email: hola@generadorcv.com
- Twitter: [@generadorcv](https://twitter.com/generadorcv)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!** - Versión Avanzada

Generador de CV profesional estilo FlowCV/Rezi con IA, formulario guiado, vista previa en tiempo real y múltiples opciones de exportación.

## 🚀 Características Principales

### ✨ Características Básicas
- ✅ **Formulario guiado paso por paso** - Una pregunta a la vez para una experiencia óptima
- ✅ **Vista previa en vivo** - El CV se actualiza automáticamente mientras completas los datos
- ✅ **Sistema de score avanzado** - Evaluación inteligente con sugerencias de mejora
- ✅ **8 Plantillas profesionales**:
  - **Premium**: Moderna, dos columnas, ideal para profesionales
  - **ATS Friendly**: Una columna, optimizada para sistemas de tracking
  - **Ejecutiva**: Elegante, azul oscuro, ideal para niveles senior
  - **Creativa**: Colores vibrantes, ideal para diseñadores
  - **Minimalista**: Limpia, espaciada, tipografía elegante
  - **Startup**: Moderna, dinámica, ideal para tech
  - **Académica**: Profesional, serif, ideal para investigadores
  - **Dark Mode**: Modo oscuro, moderno y llamativo
- ✅ **Múltiples formatos de exportación** - PDF, PNG, RTF/DOCX, ZIP completo

### 🤖 Características Avanzadas (IA-like)

#### 1. **Sistema de Score Inteligente**
- Análisis avanzado de calidad del CV (0-100%)
- Detección de métricas y logros cuantificables
- Penalización por oraciones cortas o duplicados
- Bonus por palabras clave profesionales
- **5 sugerencias específicas de mejora** en tiempo real
- Desglose detallado por sección

#### 2. **Autoguardado Automático**
- Guardado en localStorage cada segundo
- Recuperación automática al recargar
- Indicador visual de "Autoguardado"
- No pierdes tu progreso nunca

#### 3. **Validaciones Avanzadas**
- Validación de email en tiempo real
- Validación de teléfono (formatos internacionales)
- Validación de longitud mínima
- Mensajes de error contextuales
- Prevención de datos inválidos

#### 4. **Sistema de Carta de Presentación**
- Generación automática basada en tu CV
- Personalizable y editable
- Vista previa en tiempo real
- Exportable con el CV

#### 5. **Optimización Automática de Contenido**
- **Mejorar Perfil**: Reemplaza palabras informales por profesionales
- **Generar Sugerencia**: Crea un perfil basado en tu experiencia
- **Análisis de Legibilidad**: Detecta oraciones largas y palabras repetidas
- **Detección de Métricas**: Identifica logros cuantificables
- **Sugerencias de Keywords**: Por rol y industria

#### 6. **Exportaciones Múltiples**
- 📄 **PDF**: Alta calidad con Puppeteer
- 🖼️ **PNG**: Imagen de alta resolución
- 📝 **RTF/DOCX**: Compatible con Word
- 📦 **ZIP**: Pack completo (PDF + PNG + JSON)

#### 7. **Sistema de Preguntas Inteligentes**
- Preguntas adaptativas según respuestas
- Sugerencias contextuales
- Validación de completitud por paso
- Progreso porcentual global

## 📁 Estructura del Proyecto

```
/app
  /builder
    page.jsx                    # Página principal del generador
    /components
      StepPersonal.jsx          # Formulario de datos personales
      StepExperience.jsx        # Formulario de experiencia laboral
      StepEducation.jsx         # Formulario de educación
      StepSkills.jsx            # Formulario de habilidades
      StepExtras.jsx            # Información adicional
      Question.jsx              # Componente de pregunta reutilizable
      ResumePreview.jsx         # Vista previa del CV
      ProgressScore.jsx         # Barra de score/calidad
  /api
    /generate
      route.js                  # API de generación de PDF con Puppeteer

/lib
  score.js                      # Lógica de cálculo de score
  templates.js                  # Plantillas de CV

/store
  resumeStore.js                # Estado global con Zustand
```

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **Tailwind CSS** - Estilos utilitarios
- **Zustand** - Estado global simple y eficiente
- **Puppeteer** - Generación de PDF server-side

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:3000`

## 🎯 Uso

1. Haz clic en "Comenzar ahora" en la página de inicio
2. Completa cada sección paso por paso:
   - Datos personales
   - Experiencia laboral
   - Educación
   - Habilidades
   - Información adicional (opcional)
3. Observa cómo tu CV se actualiza en tiempo real
4. Selecciona la plantilla que más te guste
5. Revisa el score de calidad
6. Haz clic en "Generar PDF" para descargar

## 🎨 Plantillas

### Premium
Diseño moderno de dos columnas con gradiente morado. Ideal para profesionales que buscan destacar.

### ATS Friendly
Diseño simple de una columna sin gráficos. Optimizado para pasar sistemas de tracking de candidatos.

### Ejecutiva
Diseño elegante con tonos azules. Perfecto para posiciones senior y ejecutivas.

### Creativa
Diseño vibrante con colores y elementos visuales. Ideal para diseñadores y creativos.

## 📊 Sistema de Score

El sistema evalúa automáticamente la calidad de tu CV basándose en:
- Información personal completa (30 pts)
- Perfil profesional detallado (15 pts)
- Experiencia laboral (30 pts)
- Educación (15 pts)
- Habilidades (20 pts)
- Información adicional (10 pts bonus)

**Niveles:**
- 90-100: Excelente
- 70-89: Muy Bueno
- 50-69: Bueno
- 30-49: Regular
- 0-29: Incompleto

## 🔧 Desarrollo

### Agregar una nueva plantilla

1. Abre `lib/templates.js`
2. Agrega un nuevo objeto con la estructura:
```javascript
nuevaPlantilla: {
  name: 'Nombre de la Plantilla',
  description: 'Descripción breve',
  render: (resume) => `HTML template aquí`
}
```

### Modificar el cálculo de score

Edita `lib/score.js` para ajustar los puntos asignados a cada sección.

### Personalizar preguntas

Cada componente Step tiene un array de `questions` que puedes modificar.

## 🔒 Seguridad

### Content Security Policy (CSP) con Nonces

Este proyecto implementa CSP estricto sin `'unsafe-inline'` mediante nonces dinámicos.

#### ¿Cómo funciona?

1. **Generación de nonce**: En cada request, `middleware.js` genera un nonce criptográficamente seguro usando `crypto.randomBytes(16)`
2. **Inyección en headers**: El nonce se agrega al header `Content-Security-Policy` como `script-src 'nonce-{valor}'`
3. **Uso en componentes**: Los scripts inline deben incluir el atributo `nonce={nonce}`

#### Agregar un nuevo script con nonce

```javascript
// En un componente que necesite script inline
export default function MyComponent() {
  return (
    <>
      {/* ❌ ESTO SERÁ BLOQUEADO POR CSP */}
      <script>console.log('Hello')</script>
      
      {/* ✅ ESTO FUNCIONARÁ (React escapa automáticamente) */}
      <div onClick={() => console.log('Hello')}>Click me</div>
    </>
  )
}
```

**Nota**: React maneja eventos de forma segura sin necesitar scripts inline. Evita `dangerouslySetInnerHTML` y manipulación DOM directa.

#### Headers de Seguridad Implementados

| Header | Valor | Propósito |
|--------|-------|-----------|
| `Content-Security-Policy` | `script-src 'self' 'nonce-{nonce}' 'strict-dynamic'` | Prevenir XSS mediante control de scripts |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forzar HTTPS en todas las conexiones |
| `X-Frame-Options` | `DENY` | Prevenir clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevenir MIME sniffing |
| `Cross-Origin-Opener-Policy` | `same-origin` | Aislar contexto de navegación |
| `Cross-Origin-Resource-Policy` | `same-origin` | Controlar carga de recursos |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control de referrers |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Deshabilitar APIs sensibles |

### Trusted Types

El proyecto incluye soporte para Trusted Types mediante `require-trusted-types-for 'script'` en CSP.

**Archivo**: `lib/trustedTypes.js`

Si necesitas usar `innerHTML` o similar:
```javascript
import { createTrustedTypePolicy } from '@/lib/trustedTypes'

const policy = createTrustedTypePolicy()
element.innerHTML = policy.createHTML(sanitizedContent)
```

### Validar Datos Estructurados (JSON-LD)

```powershell
# Windows (PowerShell)
.\scripts\validate-schema.ps1 -Url "https://tu-dominio.vercel.app"

# Unix/Linux/Mac (Bash)
./scripts/validate-schema.sh https://tu-dominio.vercel.app
```

Esto validará:
- ✅ JSON sintácticamente válido
- ✅ Campos requeridos presentes (@context, @type, name, description)
- ✅ Estructura compatible con Schema.org

**Validación manual**:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

## 📝 Notas

- Puppeteer puede requerir dependencias adicionales en algunos sistemas operativos
- El PDF se genera server-side para garantizar calidad profesional
- Todas las plantillas están optimizadas para impresión en formato A4

### Mejoras UX Implementadas

**Componentes Creados:**
- `AutosaveIndicator`: Indicador visual de guardado automático (bottom-right)
- `StepperNavigation`: Navegación lateral con progreso visual
- `useDebounce`: Hook para debouncing de 200ms en live preview
- `useScrollRestoration`: Hook para restaurar scroll por sección

**Características:**
- Layout de 3 columnas: Stepper (lateral) + Formulario (centro) + Live Preview (derecha)
- Animaciones con framer-motion en transiciones de pasos
- Feedback visual de autoguardado: "Guardando..." → "Guardado ✓"
- Vista previa actualizada en tiempo real con debouncing
- Scroll restoration automático al cambiar de sección
- ARIA labels completos en todos los elementos interactivos
- Contraste mejorado (WCAG 2.1 AA): neutral-400 → neutral-600
- Loading states mejorados en exportación de PDF
- Sentry breadcrumbs en navegación y acciones críticas

**Accesibilidad:**
- ARIA labels en inputs, botones y regiones
- Contraste mínimo 4.5:1 en texto
- Estados de foco visibles
- Navegación por teclado completa
- Indicadores de paso actual (aria-current)
- Mensajes de error con role="alert"

---

## 🔍 Monitoreo de Errores con Sentry

Este proyecto utiliza **Sentry** para monitoreo de errores en producción.

### Variables de Entorno Requeridas

Configura las siguientes variables en tu proyecto de Vercel:

```bash
# Sentry DSN (Data Source Name)
SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Token de autenticación para subir source maps
SENTRY_AUTH_TOKEN=sntrys_your_auth_token_here

# Organización de Sentry
SENTRY_ORG=your-org-slug

# Proyecto de Sentry
SENTRY_PROJECT=your-project-name

# Release tracking (automático en Vercel)
SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA
```

### Obtener Credenciales de Sentry

1. **Crear cuenta en Sentry**: https://sentry.io/signup/
2. **Crear nuevo proyecto**: Tipo "Next.js"
3. **Obtener DSN**: Settings → Projects → [Tu Proyecto] → Client Keys (DSN)
4. **Crear Auth Token**: Settings → Account → API → Auth Tokens → Create New Token
   - Permisos: `project:releases`, `org:read`
5. **Copiar slugs**: Settings → General → Organization Slug / Project Slug

### Testing Local

1. **Probar captura de errores**:
   ```bash
   # En desarrollo
   npm run dev
   
   # Visitar: http://localhost:3000/api/debug-sentry
   # Deberías ver un error en Sentry dashboard
   ```

2. **⚠️ IMPORTANTE**: Eliminar el endpoint de debug antes de producción:
   ```bash
   rm app/api/debug-sentry/route.ts
   git commit -m "chore: remove debug endpoint"
   ```

### Ver Errores en Sentry

1. Ir a https://sentry.io/organizations/[tu-org]/issues/
2. Filtrar por proyecto
3. Ver stack traces completos con source maps
4. Analizar breadcrumbs de flujo de usuario
5. Revisar contexto de errores (template, plan, etc.)

### Eventos Rastreados

- ✅ **Errores en exportación de PDF** (con contexto completo)
- ✅ **Breadcrumbs de flujo de usuario** (clicks, acciones)
- ✅ **Errores de API** (automático via Sentry SDK)
- ✅ **Errores de cliente** (JavaScript exceptions)

### Privacidad y Seguridad

- Session replay **solo en errores** (no en todas las sesiones)
- Texto y media **enmascarados** en replays
- 5% de sampling en performance (reducir cuota)
- Source maps **no expuestos** al cliente (hideSourceMaps: true)

---

## 🤝 Contribuciones

Este es un proyecto de demostración. Siéntete libre de adaptarlo a tus necesidades.

---

Desarrollado con ❤️ usando Next.js y Tailwind CSS
