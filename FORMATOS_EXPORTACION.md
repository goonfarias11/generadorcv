# 📦 Formatos de Exportación - Generador de CV

## Descripción General

El generador de CV ofrece **7 formatos de exportación diferentes**, diseñados para cubrir todas las necesidades profesionales. Los formatos están divididos entre el plan **Gratuito** y el plan **Profesional**.

---

## 🆓 Plan Gratuito

### PDF (Básico)
- ✅ Disponible para todos los usuarios
- Plantilla ATS únicamente
- Incluye marca de agua
- Sin carta de presentación

---

## 💎 Plan Profesional ($2000 ARS)

### 1. 📄 PDF (Profesional)
- **Descripción**: Todas las plantillas disponibles, sin marca de agua
- **Incluye**: Carta de presentación en página separada
- **Uso recomendado**: Envío por email, aplicaciones online
- **Formato**: Portable Document Format (PDF)

### 2. 📝 DOCX (Word)
- **Descripción**: Formato RTF compatible con Microsoft Word
- **Incluye**: Toda la información del CV + carta de presentación
- **Uso recomendado**: Edición posterior en Word, personalización
- **Formato**: Rich Text Format (RTF)
- **Endpoint**: `/api/export/docx`

### 3. 📃 TXT (Texto Plano)
- **Descripción**: Versión en texto plano estructurado
- **Incluye**: Todas las secciones con separadores visuales
- **Uso recomendado**: Copiar/pegar en formularios online, ATS básicos
- **Formato**: Plain Text (UTF-8)
- **Endpoint**: `/api/export/txt`

### 4. 🌐 HTML (Página Web)
- **Descripción**: Archivo HTML estático con estilos inline
- **Incluye**: CV completo con la plantilla seleccionada
- **Uso recomendado**: Portafolio web, hosting personal
- **Formato**: HyperText Markup Language
- **Endpoint**: `/api/export/html`

### 5. { } JSON (Datos Estructurados)
- **Descripción**: Serialización completa del objeto resume
- **Incluye**: Todos los campos y datos del CV
- **Uso recomendado**: Backup, importación en otros sistemas, integración con APIs
- **Formato**: JavaScript Object Notation
- **Endpoint**: `/api/export/json`

### 6. 🖼️ PNG (Imagen)
- **Descripción**: Screenshot del CV en formato imagen PNG
- **Incluye**: Renderizado visual completo con alta calidad
- **Uso recomendado**: LinkedIn, redes sociales, WhatsApp
- **Formato**: Portable Network Graphics (PNG)
- **Endpoint**: `/api/export/image` (format: 'png')

### 7. 📷 JPG (Imagen Comprimida)
- **Descripción**: Screenshot del CV en formato JPEG
- **Incluye**: Renderizado visual con compresión optimizada
- **Uso recomendado**: Email con límite de tamaño, compartir en dispositivos móviles
- **Formato**: Joint Photographic Experts Group (JPG/JPEG)
- **Endpoint**: `/api/export/image` (format: 'jpg')

---

## 🔒 Validación de Plan

Todos los endpoints de exportación (excepto PDF básico) validan el plan del usuario:

```javascript
if (!resume || resume.plan !== 'professional') {
  return new NextResponse('Plan Profesional requerido', { status: 403 })
}
```

### Respuesta de Error (403 Forbidden)
```
Plan Profesional requerido para exportar a [FORMATO]
```

---

## 🎨 Interfaz de Usuario

### Menú Desplegable
- **Botón principal**: "📄 Generar PDF"
- **Botón secundario**: "▼" para abrir menú
- **Formatos bloqueados**: Mostrar badge "PRO" en color ámbar
- **Tooltip**: Indicar "Requiere Plan Profesional"

### Comportamiento
- Usuarios **gratuitos**: Solo pueden exportar PDF básico
- Usuarios **PRO**: Acceso completo a todos los formatos
- Al hacer clic en formato bloqueado: Alert explicativo

---

## 📋 Estructura de Datos

### Objeto Resume
```javascript
{
  name: string,
  plan: 'free' | 'professional',
  template: string,
  coverLetter: string,
  // ... otros campos
}
```

### Request Body (Endpoints PRO)
```javascript
{
  resume: {
    plan: 'professional',
    // ... datos completos del CV
  },
  format: 'png' | 'jpg' // solo para /api/export/image
}
```

---

## 🚀 Implementación Técnica

### Stack
- **Backend**: Next.js API Routes
- **Puppeteer**: Generación de PDF e imágenes
- **RTF**: Conversión HTML → RTF para Word
- **Buffer**: Manejo de archivos binarios

### Headers de Respuesta
```javascript
{
  'Content-Type': 'application/[format]',
  'Content-Disposition': `attachment; filename=CV-${name}.${ext}`
}
```

### Formatos de Content-Type
- PDF: `application/pdf`
- DOCX/RTF: `application/rtf`
- TXT: `text/plain; charset=utf-8`
- HTML: `text/html; charset=utf-8`
- JSON: `application/json`
- PNG: `image/png`
- JPG: `image/jpeg`

---

## 💡 Casos de Uso

### Escenario 1: Aplicación a empresa tradicional
→ **PDF Profesional** (formato estándar, profesional)

### Escenario 2: Editar antes de enviar
→ **DOCX** (modificar en Word)

### Escenario 3: Formulario ATS online
→ **TXT** (copiar/pegar sin formato)

### Escenario 4: Portfolio web personal
→ **HTML** (integrar en sitio web)

### Escenario 5: Backup de datos
→ **JSON** (guardar información completa)

### Escenario 6: Compartir en LinkedIn/WhatsApp
→ **PNG** (imagen de alta calidad)

### Escenario 7: Enviar por email con límite de tamaño
→ **JPG** (imagen comprimida)

---

## ✅ Testing

### Validaciones Necesarias
1. ✓ Plan gratuito solo accede a PDF básico
2. ✓ Plan PRO accede a todos los formatos
3. ✓ Endpoints retornan 403 para usuarios gratuitos
4. ✓ Carta de presentación incluida en todos los formatos PRO
5. ✓ Nombres de archivo correctos: `CV-{nombre}.{extensión}`
6. ✓ Headers Content-Type apropiados
7. ✓ Descarga automática en navegador

---

## 📊 Beneficios del Plan Profesional

| Característica | Plan Gratuito | Plan PRO |
|---------------|---------------|----------|
| Plantillas | 1 (ATS) | 8 (todas) |
| Marca de agua | Sí | No |
| Carta de presentación | No | Sí |
| Exportación PDF | Sí (básico) | Sí (avanzado) |
| Exportación DOCX | No | ✓ |
| Exportación TXT | No | ✓ |
| Exportación HTML | No | ✓ |
| Exportación JSON | No | ✓ |
| Exportación PNG | No | ✓ |
| Exportación JPG | No | ✓ |
| Precio | $0 | $2000 ARS |

---

## 🔮 Roadmap Futuro

- [ ] Exportación a PDF/A (archivo de larga duración)
- [ ] Exportación a LaTeX
- [ ] Exportación a Markdown
- [ ] Compresión ZIP con múltiples formatos
- [ ] Envío directo por email desde la app
- [ ] Integración con LinkedIn (importar/exportar)
