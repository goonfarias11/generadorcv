# Sistema de Testing - Generador de CV

## 📋 Estructura de Tests

Este proyecto incluye un sistema completo de testing con:

- ✅ **Jest + React Testing Library** - Tests unitarios y de componentes
- ✅ **Playwright** - Tests end-to-end
- ✅ **Visual Regression** - Snapshots de plantillas
- ✅ **Cobertura de Código** - Métricas de coverage

## 🚀 Comandos Disponibles

### Tests Unitarios (Jest)

```bash
# Ejecutar todos los tests unitarios
npm test

# Tests en modo watch (desarrollo)
npm run test:watch

# Tests secuenciales (más estable)
npm run test:unit

# Generar reporte de cobertura
npm run test:coverage
```

### Tests End-to-End (Playwright)

```bash
# Ejecutar tests E2E
npm run test:e2e

# Tests E2E con interfaz UI
npm run test:e2e:ui

# Tests de regresión visual
npm run test:visual

# Actualizar snapshots visuales
npm run test:visual:update
```

### Tests Completos

```bash
# Ejecutar TODOS los tests
npm run test:all

# Tests para CI/CD
npm run test:ci
```

## 📁 Estructura de Carpetas

```
tests/
├── unit/
│   ├── lib/
│   │   ├── score.test.js          # Tests del sistema de scoring
│   │   ├── templates.test.js      # Tests de plantillas
│   │   ├── validation.test.js     # Tests de validaciones
│   │   └── helpers.test.js        # Tests de helpers
│   └── store/
│       └── resumeStore.test.js    # Tests del store Zustand
├── components/
│   ├── Question.test.js           # Tests del componente Question
│   ├── ProgressScore.test.js      # Tests del score visual
│   ├── ResumePreview.test.js      # Tests de la vista previa
│   └── StepPersonal.test.js       # Tests de steps
├── integration/
│   └── builder.test.js            # Tests del flujo completo
├── api/
│   ├── generate.test.js           # Tests API PDF
│   ├── export-png.test.js         # Tests API PNG
│   ├── export-docx.test.js        # Tests API DOCX
│   └── export-zip.test.js         # Tests API ZIP
├── e2e/
│   ├── builder-flujo.spec.js      # Tests E2E del builder
│   └── autosave.spec.js           # Tests E2E de autosave
├── visual/
│   └── templates.spec.js          # Snapshots visuales
└── helpers/
    └── testUtils.js               # Utilidades para tests
```

## 📊 Cobertura de Tests

### Tests Unitarios

- ✅ **lib/score.js** - Sistema de scoring con métricas
- ✅ **lib/templates.js** - 8 plantillas de CV
- ✅ **lib/validation.js** - Validaciones de email, teléfono, URL
- ✅ **lib/helpers.js** - Funciones de optimización
- ✅ **store/resumeStore.js** - Store de Zustand

### Tests de Componentes

- ✅ **Question** - Componente de preguntas
- ✅ **ProgressScore** - Barra de progreso y score
- ✅ **ResumePreview** - Vista previa del CV
- ✅ **StepPersonal** - Paso de información personal

### Tests de Integración

- ✅ Flujo completo del builder
- ✅ Selección de plantillas
- ✅ Score dinámico
- ✅ Exportación de PDF

### Tests de API

- ✅ `/api/generate` - Generación de PDF
- ✅ `/api/export/png` - Exportación PNG
- ✅ `/api/export/docx` - Exportación DOCX
- ✅ `/api/export/zip` - Exportación ZIP

### Tests E2E

- ✅ Flujo completo de creación de CV
- ✅ Autosave y persistencia
- ✅ Validaciones en tiempo real
- ✅ Cambio de plantillas
- ✅ Actualización de score

### Tests Visuales

- ✅ Snapshot de 8 plantillas
- ✅ Responsive mobile y tablet
- ✅ CV vacío vs completo
- ✅ Score component

## 🔧 Configuración

### Jest (jest.config.js)

- Environment: jsdom
- Coverage threshold: 70%
- Mock de next/navigation
- Mock de localStorage
- Path aliases configurados

### Playwright (playwright.config.js)

- 3 navegadores: Chromium, Firefox, WebKit
- 2 dispositivos móviles: Pixel 5, iPhone 12
- Base URL: http://localhost:3000
- Auto-start dev server

### Visual Regression (playwright.visual.config.js)

- Screenshots automáticos
- Threshold: 0.2 (20% diferencia permitida)
- Max diff pixels: 100

## 📝 Ejemplos de Uso

### Ejecutar test específico

```bash
# Test unitario específico
npm test -- score.test.js

# Test E2E específico
npx playwright test builder-flujo.spec.js

# Test visual específico
npx playwright test templates.spec.js --config=playwright.visual.config.js
```

### Ver reporte de cobertura

```bash
npm run test:coverage
# Se abre en: coverage/lcov-report/index.html
```

### Debugear tests

```bash
# Jest en modo watch
npm run test:watch

# Playwright con UI interactiva
npm run test:e2e:ui

# Playwright con inspector
npx playwright test --debug
```

## 🎯 Métricas de Calidad

### Cobertura Mínima (70%)

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Tests por Categoría

- **Unitarios**: ~40 tests
- **Componentes**: ~15 tests
- **Integración**: ~10 tests
- **API**: ~15 tests
- **E2E**: ~10 tests
- **Visual**: ~14 snapshots

**Total: ~104 tests + 14 snapshots**

## 🚦 CI/CD

Para integración continua, usar:

```bash
npm run test:ci
```

Este comando ejecuta:
1. Tests unitarios en paralelo
2. Tests E2E con retry en caso de fallo

## 🐛 Troubleshooting

### Error: "Cannot find module '@/...'"

- Verificar que `jsconfig.json` existe
- Reiniciar el proceso de Jest

### Playwright no inicia el servidor

- Verificar puerto 3000 libre
- Aumentar timeout en `playwright.config.js`

### Snapshots visuales fallan

- Ejecutar `npm run test:visual:update` para actualizar
- Verificar resolución de pantalla

### Tests fallan en CI pero pasan local

- Usar `npm run test:ci` para replicar
- Verificar diferencias de timezone/locale

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✨ Características del Sistema de Testing

1. **Mocks Completos**: Puppeteer, localStorage, next/navigation
2. **Helpers Reutilizables**: Mock data, store creators
3. **Fast Execution**: Tests en paralelo donde es posible
4. **Visual Regression**: Detección automática de cambios visuales
5. **E2E Real**: Tests en navegadores reales
6. **CI-Ready**: Configurado para integración continua

---

**Nota**: Antes de hacer push, ejecutar `npm run test:ci` para asegurar que todos los tests pasan.
