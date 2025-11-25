# 📌 Notas Importantes para Producción

## ⚠️ ANTES DE DEPLOYAR

### 1. Storage de Comprobantes

**Problema:** Vercel Serverless Functions son stateless. Los archivos subidos a `/public/uploads/receipts/` NO persisten entre deployments.

**Soluciones:**

#### Opción A: Vercel Blob (Recomendado)
```bash
npm install @vercel/blob
```

Actualizar `/app/api/pro/receipt/upload/route.js`:
```javascript
import { put } from '@vercel/blob'

const blob = await put(filename, buffer, {
  access: 'public',
})

return { url: blob.url }
```

#### Opción B: AWS S3
```bash
npm install @aws-sdk/client-s3
```

#### Opción C: Cloudinary
```bash
npm install cloudinary
```

### 2. Base de Datos de Usuarios

**Problema:** `data/users.json` es local y no persiste en Vercel.

**Soluciones:**

#### Opción A: Vercel KV (Redis)
```bash
npm install @vercel/kv
```

#### Opción B: MongoDB Atlas (Gratis)
```bash
npm install mongodb
```

#### Opción C: Supabase (Gratis)
```bash
npm install @supabase/supabase-js
```

---

## 🔧 Configuración Recomendada

### Variables de Entorno en Vercel

Ir a: **Project Settings → Environment Variables**

```env
# Base URL
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app

# Storage (elegir uno)
BLOB_READ_WRITE_TOKEN=tu_token_vercel_blob

# O para S3:
AWS_ACCESS_KEY_ID=tu_key
AWS_SECRET_ACCESS_KEY=tu_secret
AWS_BUCKET_NAME=tu_bucket

# O para Cloudinary:
CLOUDINARY_URL=cloudinary://key:secret@cloud_name
```

---

## 📊 Monitoreo

### Logs en Vercel

```bash
vercel logs --follow
```

### Errores Comunes

1. **Timeout en PDF generation:**
   - Límite: 10 segundos (Hobby)
   - Solución: Optimizar templates o usar Pro plan

2. **Out of Memory:**
   - Límite: 1024 MB
   - Solución: Reducir tamaño de imágenes

3. **File Upload Failed:**
   - Causa: Filesystem efímero
   - Solución: Implementar storage externo

---

## ✅ Checklist Post-Deploy

- [ ] PDF generation funciona
- [ ] Exportaciones PRO funcionan
- [ ] Comprobantes se suben correctamente
- [ ] Admin panel carga usuarios
- [ ] No hay errores en Vercel logs
- [ ] SSL/HTTPS activo
- [ ] Dominio personalizado (opcional)

---

## 🚨 Limitaciones Actuales

### Sistema de Comprobantes

⚠️ **Estado actual:**
- Los comprobantes se suben a `/public/uploads/receipts/`
- Esto NO funciona en Vercel (filesystem efímero)

⚠️ **Necesita migración a:**
- Vercel Blob Storage
- AWS S3
- Cloudinary

### Base de Datos

⚠️ **Estado actual:**
- Usuarios en `data/users.json` (local)
- No persiste en Vercel

⚠️ **Necesita migración a:**
- Vercel KV
- MongoDB
- Supabase

---

## 🔄 Plan de Migración

### Fase 1: Deploy Básico (Actual)
✅ Generador de CV funciona
✅ Templates y exportaciones
⚠️ Sistema de comprobantes deshabilitado temporalmente

### Fase 2: Storage Externo
- [ ] Implementar Vercel Blob
- [ ] Migrar upload de comprobantes
- [ ] Testing en preview

### Fase 3: Base de Datos
- [ ] Implementar Vercel KV o MongoDB
- [ ] Migrar sistema de usuarios
- [ ] Panel admin con datos persistentes

---

## 🎯 Deploy Rápido (Sin Comprobantes)

Si querés deployar AHORA sin el sistema de comprobantes:

1. **Deshabilitar temporalmente:**

```javascript
// app/builder/components/PlanSelection.jsx
const selectProPlan = () => {
  // Activación directa sin validación (temporal)
  updateResume({ 
    subscriptionStatus: 'active',
    plan: 'professional' 
  })
}
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Agregar nota:**
> "Sistema de validación en mantenimiento. Plan PRO activado temporalmente."

---

## 📞 Ayuda

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
