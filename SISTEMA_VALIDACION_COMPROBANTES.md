# 🔐 Sistema de Validación de Comprobantes - Plan PRO

## Descripción General

Sistema completo de validación manual de comprobantes de pago para activar el Plan Profesional ($2000 ARS).

---

## 📋 Estados de Suscripción

### `subscriptionStatus` en Store

```javascript
'none'    → Usuario gratuito (no ha intentado activar PRO)
'pending' → Comprobante subido, esperando validación del admin
'active'  → Plan PRO aprobado y activo
'expired' → (Reservado para vencimientos futuros)
```

---

## 🔄 Flujo Completo

### 1. Usuario Plan Gratuito

**Estado inicial:**
```javascript
{
  plan: 'free',
  subscriptionStatus: 'none',
  receiptUrl: null
}
```

**Restricciones:**
- ✅ Exportar PDF básico (plantilla ATS con marca de agua)
- ❌ Exportar DOCX, TXT, JSON, HTML, PNG, JPG
- ❌ Carta de presentación
- ❌ Plantillas premium

---

### 2. Usuario Solicita Plan PRO

**Acción:** Click en "Activar Plan Profesional"

**UI mostrada:**
1. Instrucciones de pago (Mercado Pago)
2. Input para adjuntar comprobante
3. Preview si es imagen
4. Botón "Enviar comprobante"

**Validaciones frontend:**
- Formatos: `.jpg`, `.jpeg`, `.png`, `.pdf`
- Tamaño máximo: 5MB
- Requiere nombre y email completados

---

### 3. Usuario Sube Comprobante

**Request Flow:**

```
1. Upload file → POST /api/pro/receipt/upload
   - Valida formato y tamaño
   - Guarda en /public/uploads/receipts/
   - Retorna { url }

2. Submit data → POST /api/pro/submit
   - Crea/actualiza usuario en data/users.json
   - Establece subscriptionStatus: 'pending'
   
3. Update local state
   - subscriptionStatus = 'pending'
   - receiptUrl = url
```

**Estado resultante:**
```javascript
{
  plan: 'free',
  subscriptionStatus: 'pending',
  receiptUrl: '/uploads/receipts/receipt_1234567890.jpg'
}
```

**UI mostrada:**
```
⏳ Comprobante enviado ✔
Estamos validando tu pago. Esto puede demorar hasta 12 horas.
Te notificaremos cuando tu Plan PRO esté activo.
```

**Restricciones:**
- ✅ Exportar PDF (pero con marca de agua "VALIDACIÓN PENDIENTE")
- ❌ Todos los formatos PRO bloqueados
- ❌ Carta de presentación no disponible
- ❌ Plantillas premium no disponibles

**Respuesta 403 al intentar exportar:**
```
Tu comprobante está en validación. Te notificaremos cuando tu Plan PRO esté activo.
```

---

### 4. Admin Valida Comprobante

**Panel Admin:** `/admin/receipts`

**Endpoints:**

```javascript
// Listar pendientes
GET /api/pro/verify
→ { pending: [...usuarios], total: 5 }

// Aprobar
POST /api/pro/verify
{ userId: "123", action: "approve" }
→ subscriptionStatus = 'active', plan = 'professional'

// Rechazar
POST /api/pro/verify
{ userId: "123", action: "reject" }
→ subscriptionStatus = 'none', plan = 'free', receiptUrl = null
```

**UI del admin muestra:**
- Nombre del usuario
- Email
- Fecha de envío
- Preview del comprobante (imagen o link PDF)
- Botones: "✓ Aprobar Plan PRO" | "✕ Rechazar"

---

### 5. Comprobante Aprobado

**Estado resultante:**
```javascript
{
  plan: 'professional',
  subscriptionStatus: 'active',
  receiptUrl: '/uploads/receipts/receipt_1234567890.jpg',
  approvedAt: '2025-11-17T12:00:00.000Z'
}
```

**UI mostrada:**
```
✓ Plan Profesional Activado
Acceso completo a todas las plantillas y formatos de exportación
```

**Acceso desbloqueado:**
- ✅ PDF sin marca de agua
- ✅ Exportar DOCX, TXT, JSON, HTML, PNG, JPG
- ✅ Carta de presentación
- ✅ Todas las 8 plantillas

---

### 6. Comprobante Rechazado

**Estado resultante:**
```javascript
{
  plan: 'free',
  subscriptionStatus: 'none',
  receiptUrl: null,
  rejectedAt: '2025-11-17T12:00:00.000Z'
}
```

**Usuario vuelve a estado inicial (gratuito)**

---

## 🛡️ Validaciones en Endpoints

### Estructura de validación (todos los exports PRO)

```javascript
// /api/export/[docx|txt|json|html|image]/route.js

if (!resume || resume.subscriptionStatus !== 'active') {
  if (resume?.subscriptionStatus === 'pending') {
    return new NextResponse(
      'Tu comprobante está en validación. Te notificaremos cuando tu Plan PRO esté activo.',
      { status: 403 }
    )
  }
  return new NextResponse(
    'Plan Profesional requerido para exportar a [FORMATO]',
    { status: 403 }
  )
}
```

---

## 📁 Estructura de Archivos

### Backend

```
app/
├── api/
│   ├── pro/
│   │   ├── receipt/upload/route.js  → Sube archivo
│   │   ├── submit/route.js          → Registra solicitud
│   │   └── verify/route.js          → GET/POST aprobaciones
│   └── export/
│       ├── docx/route.js            → Validación PRO
│       ├── txt/route.js             → Validación PRO
│       ├── json/route.js            → Validación PRO
│       ├── html/route.js            → Validación PRO
│       └── image/route.js           → Validación PRO
└── admin/
    └── receipts/page.jsx            → Panel admin
```

### Frontend

```
app/builder/components/
└── PlanSelection.jsx                → Formulario upload
```

### Storage

```
public/uploads/receipts/             → Comprobantes subidos
data/users.json                      → Base de datos simple
```

---

## 🎨 Componentes UI

### PlanSelection.jsx

**Estados visuales:**

1. **Plan Gratuito (default)**
   - Grid con 2 cards: Gratis vs PRO
   - Botón "Usar Plan Gratis" / "Activar Plan PRO"

2. **Modal de pago (showPayment)**
   - Instrucciones de transferencia
   - Input file para comprobante
   - Preview si es imagen
   - Botones: "Enviar comprobante" / "Cancelar"

3. **Estado pending**
   - Banner ámbar con ⏳
   - Mensaje de validación
   - No permite reenviar

4. **Estado active**
   - Banner verde con ✓
   - Mensaje de confirmación

---

## 🔐 Panel de Administración

### `/admin/receipts`

**Acceso:** Sin autenticación (agregar en producción)

**Funcionalidades:**
- Lista de usuarios con `subscriptionStatus === 'pending'`
- Preview de comprobantes
- Botón aprobar → activa plan PRO
- Botón rechazar → vuelve a plan free

**Datos mostrados:**
- Nombre
- Email
- Fecha de envío
- Estado actual
- Comprobante (imagen o PDF)

---

## 💾 Modelo de Datos

### Store (Zustand)

```javascript
resume: {
  // ... campos existentes
  plan: 'free' | 'professional',
  subscriptionStatus: 'none' | 'pending' | 'active' | 'expired',
  receiptUrl: string | null
}
```

### users.json

```json
[
  {
    "id": "1700000000000",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "receiptUrl": "/uploads/receipts/receipt_1700000000000.jpg",
    "subscriptionStatus": "pending",
    "plan": "free",
    "submittedAt": "2025-11-17T10:00:00.000Z",
    "approvedAt": null,
    "rejectedAt": null
  }
]
```

---

## 🚀 Deployment

### Configuración necesaria

1. **Directorio de uploads**
   - Crear `/public/uploads/receipts/`
   - Permisos de escritura

2. **Directorio de datos**
   - Crear `/data/`
   - Inicializar `users.json` con `[]`

3. **Variables de entorno** (opcional)
   ```env
   ADMIN_PASSWORD=tu_password_seguro
   ```

---

## ✅ Checklist de Testing

### Frontend
- [ ] Subir imagen JPG → Preview correcto
- [ ] Subir archivo PDF → Mensaje "Archivo PDF"
- [ ] Validación 5MB → Alert de error
- [ ] Validación formato → Alert de error
- [ ] Estado pending → Banner ámbar
- [ ] Estado active → Banner verde

### Backend
- [ ] Upload endpoint → Archivo guardado
- [ ] Submit endpoint → Usuario creado en JSON
- [ ] Verify GET → Lista de pendientes
- [ ] Verify POST approve → Estado = active
- [ ] Verify POST reject → Estado = none

### Exportaciones
- [ ] PDF pending → Marca de agua "VALIDACIÓN PENDIENTE"
- [ ] DOCX pending → 403 con mensaje
- [ ] PNG active → Exporta correctamente
- [ ] JSON free → 403 "Plan Profesional requerido"

---

## 🔮 Mejoras Futuras

- [ ] Autenticación para panel admin
- [ ] Notificaciones por email
- [ ] Base de datos real (PostgreSQL/MongoDB)
- [ ] CDN para almacenamiento de comprobantes
- [ ] Sistema de tickets/soporte
- [ ] Dashboard de métricas
- [ ] Historial de aprobaciones/rechazos
