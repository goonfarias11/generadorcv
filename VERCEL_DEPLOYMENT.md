# 🚀 Guía de Deployment a Vercel

## 📋 Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub con el código
- Node.js 18+ instalado localmente

---

## ⚙️ Configuración Inicial

### 1. Preparar el proyecto

```bash
# Asegurarse de que el proyecto compile sin errores
npm run build

# Verificar que no haya errores de lint
npm run lint
```

### 2. Variables de entorno (opcional)

Si necesitás variables de entorno, crealas en Vercel:

**Ir a:** Project Settings → Environment Variables

```env
# Ejemplo (ajustar según necesidad)
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
```

---

## 🌐 Deploy desde GitHub

### Método Recomendado: Importar desde GitHub

1. **Subir el código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/goonfarias11/generadorcv.git
   git push -u origin main
   ```

2. **Conectar con Vercel:**
   - Ir a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Seleccionar "Import Git Repository"
   - Autorizar acceso a GitHub
   - Seleccionar el repositorio `generadorcv`

3. **Configuración del proyecto:**
   - Framework Preset: **Next.js**
   - Root Directory: `.` (dejar por defecto)
   - Build Command: `npm run build` (auto-detectado)
   - Output Directory: `.next` (auto-detectado)
   - Install Command: `npm install` (auto-detectado)

4. **Click en "Deploy"**
   - Vercel detectará automáticamente Next.js
   - El build tardará 2-3 minutos
   - Una vez completado, tendrás una URL: `https://generadorcv-xxx.vercel.app`

---

## 💻 Deploy desde CLI (alternativa)

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
# Preview deployment (testing)
vercel

# Production deployment
vercel --prod
```

---

## 🔧 Configuración Avanzada

### vercel.json (ya configurado)

El archivo `vercel.json` está optimizado con:

✅ **Memory allocation** por endpoint
✅ **Max duration** para evitar timeouts
✅ **Cache headers** para assets estáticos
✅ **Puppeteer config** para generación de PDF

### Funciones Serverless

| Endpoint | Memoria | Timeout |
|----------|---------|---------|
| `/api/generate` (PDF) | 1024 MB | 10s |
| `/api/export/image` | 1024 MB | 10s |
| `/api/export/docx` | 512 MB | 5s |
| `/api/export/txt` | 256 MB | 5s |
| `/api/export/json` | 256 MB | 5s |
| `/api/export/html` | 256 MB | 5s |

---

## 📁 Archivos Ignorados

### .vercelignore

Ya configurado para excluir:
- Comprobantes de pago (`public/uploads/receipts/*`)
- Base de datos local (`data/users.json`)

### .gitignore

Ya configurado para excluir:
- `node_modules/`
- `.env*`
- `.vercel/`
- Uploads y data local

---

## 🎯 Post-Deployment

### 1. Verificar que funcione

Visitar la URL de Vercel y probar:
- ✅ Página principal carga
- ✅ Builder funciona
- ✅ Generación de PDF
- ✅ Exportación de formatos PRO (si tenés plan activo)
- ✅ Sistema de comprobantes

### 2. Configurar dominio personalizado (opcional)

**En Vercel Dashboard:**
1. Settings → Domains
2. Agregar tu dominio: `www.tu-dominio.com`
3. Seguir instrucciones DNS

### 3. Habilitar Analytics (opcional)

**En Vercel Dashboard:**
- Analytics → Enable Vercel Analytics
- Obtener insights de tráfico y performance

---

## 🔄 Actualizaciones Automáticas

Con GitHub conectado, cada `git push` a `main` desplegará automáticamente:

```bash
# Hacer cambios
git add .
git commit -m "Feature: nueva funcionalidad"
git push origin main

# Vercel detecta el push y despliega automáticamente
```

### Branches de preview

Cualquier branch que no sea `main` genera un preview deployment:

```bash
git checkout -b feature/nueva-funcion
git add .
git commit -m "WIP: nueva función"
git push origin feature/nueva-funcion

# Vercel genera URL de preview: https://generadorcv-xxx-branch.vercel.app
```

---

## ⚠️ Troubleshooting

### Error: "Module not found"

**Solución:** Verificar que todas las dependencias estén en `package.json`

```bash
npm install
npm run build
```

### Error: Puppeteer timeout

**Solución:** Ya configurado en `vercel.json` con `maxDuration: 10`

Si persiste, considerar usar `@sparticuz/chromium`:
```bash
npm install @sparticuz/chromium
```

### Error 413 (Payload too large)

**Solución:** Vercel tiene límite de 4.5MB por request body

Para PDFs grandes, considerar streaming o compresión.

### Comprobantes no se guardan

**Causa:** Vercel Serverless Functions son stateless

**Solución:** Usar almacenamiento externo:
- Vercel Blob Storage
- AWS S3
- Cloudinary

---

## 📊 Monitoreo

### Logs en tiempo real

```bash
vercel logs [deployment-url]
```

### Dashboard de Vercel

- **Analytics:** Visitas, performance
- **Logs:** Errores de funciones
- **Deployments:** Historial completo

---

## 💰 Planes de Vercel

### Hobby (Gratis)
- ✅ Ilimitados deployments
- ✅ 100GB bandwidth/mes
- ✅ Serverless Functions
- ⚠️ Timeout máximo: 10s

### Pro ($20/mes)
- ✅ Timeouts hasta 60s
- ✅ 1TB bandwidth
- ✅ Analytics avanzados
- ✅ Más memoria por función

---

## 🔐 Seguridad

### Ambiente de producción

1. **No commitear:**
   - Archivos `.env`
   - Comprobantes de pago
   - Base de datos local

2. **Variables sensibles:**
   - Configurar en Vercel Dashboard
   - Nunca en el código

3. **API Keys:**
   - Rotar periódicamente
   - Usar variables de entorno

---

## ✅ Checklist Pre-Deploy

- [ ] `npm run build` sin errores
- [ ] `npm run lint` sin warnings críticos
- [ ] `.gitignore` actualizado
- [ ] `.vercelignore` configurado
- [ ] `vercel.json` optimizado
- [ ] Variables de entorno configuradas (si aplica)
- [ ] Tests pasando (si aplica)
- [ ] README actualizado con URL de producción

---

## 🎉 Deploy Exitoso

Una vez deployado:

1. **URL de producción:** `https://generadorcv.vercel.app`
2. **SSL automático:** Vercel provee HTTPS gratis
3. **CDN global:** Distribución mundial automática
4. **Auto-scaling:** Escala según demanda

---

## 📞 Soporte

- [Documentación Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## 🚀 Comando Rápido

```bash
# One-liner para deploy desde CLI
vercel --prod
```

**¡Listo!** Tu CV Generator está en producción 🎉
