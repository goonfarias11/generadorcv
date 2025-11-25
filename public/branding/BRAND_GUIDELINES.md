# 🎨 Guía de Branding - GeneradorCV

## 📋 Índice

- [Identidad Visual](#identidad-visual)
- [Logo](#logo)
- [Colores](#colores)
- [Tipografía](#tipografía)
- [Iconografía](#iconografía)
- [Uso del Logo](#uso-del-logo)
- [Assets Disponibles](#assets-disponibles)

## 🎯 Identidad Visual

GeneradorCV es una herramienta moderna, profesional y accesible para crear currículums. Nuestra identidad visual refleja:

- **Profesionalismo**: Diseño limpio y confiable
- **Modernidad**: Uso de gradientes y diseño contemporáneo
- **Accesibilidad**: Colores con contraste WCAG AA
- **Dinamismo**: Elementos que sugieren acción y progreso

## 📱 Logo

### Logo Principal

- **Archivo**: `/public/branding/logo.svg`
- **Dimensiones**: 200x60px
- **Formato**: SVG (escalable)
- **Uso**: Headers, landing page, documentos

### Icono

- **Archivo**: `/public/branding/icon.svg`
- **Dimensiones**: 48x48px
- **Formato**: SVG
- **Uso**: App icon, redes sociales, favicon

### Favicon

- **Archivo**: `/public/favicon.svg`
- **Dimensiones**: 32x32px
- **Formato**: SVG
- **Uso**: Navegadores, PWA

## 🎨 Colores

### Paleta Principal

```css
/* Indigo (Principal) */
--indigo-50:  #EEF2FF
--indigo-100: #E0E7FF
--indigo-500: #6366F1  /* Color primario */
--indigo-600: #4F46E5  /* Hover states */
--indigo-700: #4338CA  /* Active states */
--indigo-900: #312E81

/* Purple (Secundario) */
--purple-50:  #FAF5FF
--purple-500: #A855F7
--purple-600: #9333EA

/* Grays (Neutrales) */
--gray-50:  #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-600: #4B5563
--gray-700: #374151
--gray-900: #111827
```

### Paleta Semántica

```css
/* Success */
--green-50:  #F0FDF4
--green-500: #10B981
--green-600: #059669

/* Warning */
--yellow-50:  #FFFBEB
--yellow-500: #F59E0B

/* Error */
--red-50:  #FEF2F2
--red-500: #EF4444
--red-600: #DC2626
```

### Gradientes

```css
/* Gradiente Principal */
background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);

/* Gradiente Sutil */
background: linear-gradient(to bottom right, #EEF2FF, #FAF5FF);

/* Gradiente Landing */
background: linear-gradient(to bottom right, #EFF6FF, #F3E8FF, #FCE7F3);
```

## ✍️ Tipografía

### Fuente Principal: Inter

- **Familia**: Inter (Google Fonts)
- **Pesos**:
  - Regular (400): Texto general
  - Medium (500): Subtítulos
  - Semibold (600): Énfasis
  - Bold (700): Títulos principales
  - Extrabold (800): Hero sections

### Escala Tipográfica

```css
/* Headings */
h1: 3rem (48px) - font-weight: 800
h2: 2.25rem (36px) - font-weight: 700
h3: 1.875rem (30px) - font-weight: 700
h4: 1.5rem (24px) - font-weight: 600
h5: 1.25rem (20px) - font-weight: 600

/* Body */
body: 1rem (16px) - font-weight: 400
small: 0.875rem (14px) - font-weight: 400
tiny: 0.75rem (12px) - font-weight: 400
```

## 🎭 Iconografía

### Estilo de Iconos

- **Biblioteca**: Lucide Icons / Heroicons
- **Estilo**: Outline (preferido) / Solid (para énfasis)
- **Tamaño estándar**: 24x24px
- **Color**: Hereda del texto o usa `text-indigo-600`

### Iconos Principales

```
📄 CV/Resume
🎨 Plantillas
💾 Exportar
⚡ Rápido
🚀 Comenzar
💎 PRO
📊 Analytics
🌐 Idiomas
✨ IA
📈 Score
```

## 📐 Uso del Logo

### Espaciado Mínimo

- Mantener un espaciado mínimo equivalente a la altura del icono CV
- No colocar otros elementos dentro de este espacio

### Tamaños Mínimos

- **Digital**: 120px de ancho mínimo
- **Impresión**: 30mm de ancho mínimo
- **Favicon**: 32x32px

### Usos Correctos ✅

- Sobre fondo blanco o gris muy claro
- Sobre fondo degradado suave
- Con suficiente contraste
- Centrado o alineado a la izquierda

### Usos Incorrectos ❌

- No estirar o distorsionar
- No cambiar colores (usar versión monocromática si es necesario)
- No rotar
- No agregar efectos (sombras, bordes, etc.)
- No usar sobre fondos con bajo contraste

## 📦 Assets Disponibles

### Estructura de Archivos

```
/public
  └── branding
      ├── logo.svg              # Logo completo (200x60)
      ├── logo-white.svg        # Logo blanco (para fondos oscuros)
      ├── icon.svg              # Icono app (48x48)
      ├── icon-rounded.svg      # Icono con bordes redondeados
      └── wordmark.svg          # Solo texto "GeneradorCV"
  
  ├── favicon.svg               # Favicon principal
  ├── favicon.ico               # Favicon legacy
  ├── apple-touch-icon.png      # iOS (180x180)
  ├── icon-192.png              # PWA small (192x192)
  └── icon-512.png              # PWA large (512x512)
```

### Formatos de Exportación

| Uso | Formato | Dimensiones |
|-----|---------|-------------|
| Web/Digital | SVG | Vectorial |
| Favicon | ICO/SVG | 32x32 |
| iOS Icon | PNG | 180x180 |
| Android Icon | PNG | 192x192, 512x512 |
| OG Image | PNG/JPG | 1200x630 |
| Twitter Card | PNG/JPG | 1200x600 |

## 🌈 Aplicaciones

### Botones

```css
/* Primary */
background: linear-gradient(to right, #6366F1, #A855F7);
color: white;
border-radius: 0.5rem;

/* Secondary */
background: white;
color: #6366F1;
border: 2px solid #6366F1;
border-radius: 0.5rem;

/* Ghost */
background: transparent;
color: #4B5563;
hover:background: #F3F4F6;
```

### Cards

```css
background: white;
border-radius: 1rem;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
hover:box-shadow: 0 10px 25px rgba(0,0,0,0.1);
```

### Badges

```css
background: linear-gradient(to right, #FBBF24, #F59E0B);
color: white;
border-radius: 9999px;
font-size: 0.875rem;
font-weight: 700;
```

## 📱 Redes Sociales

### Medidas Recomendadas

- **Facebook**: 1200x630px
- **Twitter**: 1200x600px
- **LinkedIn**: 1200x627px
- **Instagram**: 1080x1080px (cuadrado)

### Color de Marca

- Hex: `#6366F1`
- RGB: `99, 102, 241`
- HSL: `239, 84%, 67%`

## 📄 Licencia

Todos los assets de branding son propiedad de GeneradorCV. Su uso está restringido a:

- Materiales oficiales del producto
- Comunicación autorizada
- Prensa (con permiso previo)

**Prohibido**:
- Uso comercial sin autorización
- Modificación sin permiso
- Uso que implique afiliación falsa

## 🤝 Contacto

Para solicitudes de branding o assets adicionales:
- Email: branding@generadorcv.com
- Notion: [Brand Guidelines](https://notion.so/generadorcv)

---

**Versión**: 1.0  
**Última actualización**: Enero 2024
