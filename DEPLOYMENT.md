# 🚀 Guía de Despliegue - GeneradorCV

## 📋 Contenido

- [Preparación Pre-Deploy](#preparación-pre-deploy)
- [Deploy en Vercel](#deploy-en-vercel)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Configuración de Webhooks](#configuración-de-webhooks)
- [Testing en Producción](#testing-en-producción)
- [Monitoreo](#monitoreo)

## 🔧 Preparación Pre-Deploy

### 1. Instalar Dependencias de Producción

```bash
npm install stripe mercadopago chrome-aws-lambda puppeteer-core next-mdx-remote
```

### 2. Verificar Variables de Entorno

Crea un archivo `.env.local` con:

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_WEBHOOK_URL=https://tu-dominio.vercel.app/api/payments/mp/webhook

# General
NEXT_PUBLIC_URL=https://tu-dominio.vercel.app
NODE_ENV=production
```

### 3. Verificar Build Local

```bash
npm run build
npm run start
```

Abre `http://localhost:3000` y verifica:
- ✅ Landing page se carga correctamente
- ✅ Builder funciona sin errores
- ✅ Exportaciones (PDF, PNG, DOCX, ZIP) funcionan
- ✅ Sistema PRO carga
- ✅ Blog funciona
- ✅ i18n funciona (es, en, pt)

### 4. Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Tests visuales
npm run test:visual

# Todos los tests
npm run test:all
```

### 5. Análisis de Performance

```bash
# Lighthouse local
npm run lighthouse:local

# Bundle analyzer
npm run analyze
```

## 🚀 Deploy en Vercel

### Opción 1: Deploy con CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy a preview
npm run deploy:preview

# Deploy a producción
npm run deploy
```

### Opción 2: Deploy desde GitHub

1. Conecta tu repositorio a Vercel
2. Importa el proyecto
3. Configura las variables de entorno
4. Deploy automático en cada push

### Opción 3: Dashboard de Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio Git
3. Configura:
   - Framework: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

## 🔐 Configuración de Variables de Entorno

En el **Dashboard de Vercel** > **Settings** > **Environment Variables**, añade:

### Variables de Producción

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_WEBHOOK_URL=https://tu-dominio.vercel.app/api/payments/mp/webhook
NEXT_PUBLIC_URL=https://tu-dominio.vercel.app
NODE_ENV=production
```

### Scope de Variables

- **Production**: Solo para producción
- **Preview**: Para ramas de preview
- **Development**: Para desarrollo local

## 🔔 Configuración de Webhooks

### Stripe Webhooks

1. Ve a [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Clic en "Add endpoint"
3. URL: `https://tu-dominio.vercel.app/api/payments/stripe/webhook`
4. Selecciona eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia el **Signing Secret** y añádelo a `STRIPE_WEBHOOK_SECRET`

### Mercado Pago Webhooks

1. Ve a [MercadoPago > Webhooks](https://www.mercadopago.com.ar/developers/panel/webhooks)
2. URL: `https://tu-dominio.vercel.app/api/payments/mp/webhook`
3. Eventos: `payment`, `subscription`

## 🧪 Testing en Producción

### 1. Verificar Endpoints

```bash
curl https://tu-dominio.vercel.app/api/health
curl https://tu-dominio.vercel.app/api/generate
```

### 2. Probar Webhooks

**Stripe:**
```bash
stripe trigger checkout.session.completed
```

**Mercado Pago:**
Usa el sandbox de MercadoPago para generar pagos de prueba.

### 3. Lighthouse CI

```bash
npm run lighthouse
```

Verifica que los scores sean:
- Performance: ≥ 80
- Accessibility: ≥ 90
- Best Practices: ≥ 80
- SEO: ≥ 90

## 📊 Monitoreo

### Vercel Analytics

Habilita **Vercel Analytics** en el dashboard:
- Web Vitals
- Real User Monitoring (RUM)
- Error tracking

### External Analytics

Integra analytics externos en `app/layout.jsx`:

```javascript
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

// Plausible
<script defer data-domain="tu-dominio.com" src="https://plausible.io/js/script.js"></script>

// Umami
<script async src="https://analytics.umami.is/script.js" data-website-id="xxx"></script>
```

### Error Monitoring

Integra Sentry para error tracking:

```bash
npm install @sentry/nextjs
```

## 🔄 CI/CD

### GitHub Actions

Crea `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run lighthouse
```

## 📝 Checklist Pre-Deploy

- [ ] Tests pasando (unit + e2e + visual)
- [ ] Build sin errores
- [ ] Variables de entorno configuradas
- [ ] Webhooks configurados
- [ ] Lighthouse score ≥ 80
- [ ] SEO metadata verificado
- [ ] OG images funcionando
- [ ] Sitemap generado
- [ ] robots.txt correcto
- [ ] Favicon y logos en su lugar
- [ ] i18n funcionando (es, en, pt)
- [ ] Blog funcionando
- [ ] Sistema PRO funcionando
- [ ] Exportaciones funcionando (PDF, PNG, DOCX, ZIP)

## 🚨 Troubleshooting

### Error: Puppeteer no funciona en Vercel

✅ **Solución**: Usa `chrome-aws-lambda` en producción:

```javascript
// lib/puppeteer-config.js
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const browser = await chromium.puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
```

### Error: Build timeout

✅ **Solución**: Aumenta el timeout en `vercel.json`:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

### Error: 404 en rutas dinámicas

✅ **Solución**: Verifica que `generateStaticParams` esté exportado en páginas dinámicas.

## 📈 Post-Deploy

### 1. Verificar Funcionamiento

- [ ] Landing page carga
- [ ] Builder funciona
- [ ] Exportaciones funcionan
- [ ] Pagos funcionan (test mode primero)
- [ ] Blog se renderiza
- [ ] i18n funciona
- [ ] SEO correcto (verificar con [metatags.io](https://metatags.io))

### 2. Configurar DNS (si usas dominio custom)

En tu proveedor DNS:
- `A` record → Vercel IP
- `CNAME` record → `cname.vercel-dns.com`

En Vercel > Settings > Domains:
- Add domain
- Verify DNS

### 3. Configurar SSL

Vercel configura SSL automáticamente. Verifica que HTTPS funcione.

### 4. Submit a Google

```bash
# Sitemap
https://tu-dominio.com/sitemap.xml

# Google Search Console
https://search.google.com/search-console
```

## 🎉 ¡Listo!

Tu app está deployada. Monitorea:
- Analytics
- Error logs
- Performance metrics
- Conversion rates

---

**Soporte**: deploy@generadorcv.com
