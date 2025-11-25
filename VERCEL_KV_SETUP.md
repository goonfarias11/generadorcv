# Configuración de Vercel KV para Monetización

## ✅ Sistema Implementado

El generador de CV ahora usa **Vercel KV** (Redis) para almacenar:
- Usuarios registrados
- Estados de suscripción (none/pending/active/rejected)
- Comprobantes de pago (base64)
- Información de contacto

## 🔧 Configuración en Vercel

### Paso 1: Crear base de datos KV

1. Ve a tu proyecto en Vercel Dashboard
2. Click en la pestaña **Storage**
3. Click en **Create Database**
4. Selecciona **KV (Redis)**
5. Nombre: `generadorcv-kv`
6. Click **Create**

### Paso 2: Conectar al proyecto

Vercel automáticamente creará estas variables de entorno:
```
KV_REST_API_URL
KV_REST_API_TOKEN
KV_REST_API_READ_ONLY_TOKEN
KV_URL
```

**No necesitas configurar nada más.** Las variables se inyectan automáticamente.

### Paso 3: Verificar conexión

Después del próximo deploy, el sistema estará activo.

## 📊 Flujo de Monetización

### 1. Usuario selecciona Plan PRO
- Click en "Activar Plan Profesional"
- Ve instrucciones de pago:
  - **Alias:** generadorcv
  - **CBU:** 0000003100095184668063
  - **Titular:** Gonzalo Farias
  - **Monto:** $2000 ARS

### 2. Upload de comprobante
- Usuario sube imagen/PDF del pago
- Se guarda en base64 en Vercel KV
- Estado: `pending`

### 3. Admin aprueba pago
- Ve a: `/admin/receipts`
- Revisa comprobantes pendientes
- Click en "Aprobar" o "Rechazar"

### 4. Usuario accede a PRO
- Estado cambia a `active`
- Se quita marca de agua
- Acceso a todas las plantillas
- Exportación en múltiples formatos

## 🔐 Panel de Administración

URL: `/admin/receipts`

**Funciones:**
- Ver todos los comprobantes pendientes
- Ver imagen/PDF del comprobante
- Aprobar → Estado: `active`
- Rechazar → Estado: `rejected`

## 📈 Datos almacenados

```javascript
{
  id: "user_1234567890_abc123",
  email: "cliente@ejemplo.com",
  name: "Juan Pérez",
  phone: "+54 9 11 1234-5678",
  receiptUrl: "data:image/jpeg;base64,...",
  subscriptionStatus: "pending|active|rejected",
  createdAt: "2025-11-19T00:00:00.000Z",
  updatedAt: "2025-11-19T00:00:00.000Z",
  activatedAt: "2025-11-19T01:00:00.000Z" // solo si active
}
```

## 🚀 Deploy

```bash
vercel --prod
```

El sistema funcionará automáticamente después del deploy.

## 💡 Mejoras Futuras

1. **Vercel Blob Storage** - Para almacenar comprobantes como archivos
2. **Notificaciones por Email** - Enviar email cuando se apruebe el pago
3. **Dashboard de métricas** - Ver conversiones, ingresos, etc.
4. **Códigos de descuento** - Sistema de cupones
5. **Múltiples CVs por usuario** - Permitir crear varios CVs con un solo pago

## 🔍 Verificar funcionamiento

1. Ir a `/builder`
2. Seleccionar "Plan Profesional"
3. Subir comprobante
4. Ir a `/admin/receipts`
5. Aprobar el pago
6. Volver al builder y verificar que muestra "Plan Profesional Activado"

## ⚠️ Importante

- Los comprobantes se guardan en base64 (pueden ser grandes)
- Vercel KV tiene límites de tamaño por key (10MB)
- Para producción real, migrar a Vercel Blob
- El panel de admin NO tiene autenticación (agregar antes de producción)

## 📞 Soporte

Si hay problemas:
1. Verificar que KV está conectado en Vercel Dashboard
2. Revisar logs de deployment
3. Verificar que las variables de entorno están inyectadas
