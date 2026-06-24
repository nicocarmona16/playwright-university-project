# Playwright University Project - Login Tests

Este proyecto contiene pruebas automatizadas de login utilizando Playwright con TypeScript, implementadas siguiendo las mejores prácticas de Page Object Model (POM) y fixtures personalizados.

## 📁 Estructura del Proyecto

```
playwright-university-project/
├── fixtures/
│   └── web-fixtures.ts          # Fixtures personalizados para testing web
├── pages/
│   ├── BasePage.ts              # Clase base para Page Objects
│   ├── LoginPage.ts             # POM para la página de login
│   └── HomePage.ts              # POM para la página principal
├── tests/
│   └── web/
│       └── login.spec.ts        # Tests de login implementados
├── utils/
│   └── TestUtils.ts             # Utilidades para testing
├── playwright.config.ts         # Configuración de Playwright
├── package.json                 # Dependencias del proyecto
└── README.md                    # Este archivo
```

## 🚀 Instalación y Configuración

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Instalar navegadores de Playwright**
   ```bash
   npx playwright install
   ```

3. **Verificar instalación**
   ```bash
   npx playwright --version
   ```

## 🧪 Cómo Ejecutar los Tests

### Ejecutar todos los tests
```bash
npx playwright test
```

### Ejecutar tests exclusivamente en Google Chrome
```bash
npx playwright test --project="Google Chrome"
```

### Ejecutar tests con modo debug
```bash
npx playwright test --debug
```

### Ejecutar tests con interfaz gráfica (UI Mode)
```bash
npx playwright test --ui
```

### Ejecutar tests en modo headed (con ventana visible)
```bash
npx playwright test --headed
```

### Ejecutar un escenario específico
```bash
npx playwright test --grep "ESCENARIO 1: Successful Login"
npx playwright test --grep "ESCENARIO 2: Failed Login"
```

### Generar reporte HTML
```bash
npx playwright show-report
```

## 📋 Descripción de los Tests

### Tests Implementados

1. **ESCENARIO 1: Successful Login**
   - Navega a la página de login
   - Ingresa credenciales válidas (`testing.skills@globant.com` / `testing123`)
   - Verifica redirección a página principal (`http://localhost:9002/`)
   - Confirma visualización de contenido de trainees

2. **ESCENARIO 2: Failed Login (Invalid Credentials)**
   - Navega a la página de login
   - Ingresa credenciales inválidas generadas dinámicamente con dominio `@globant.com`
   - Verifica mensajes de error esperados ("Login Failed" o "Invalid credentials...")
   - Maneja tanto casos de error mostrados como redirecciones inesperadas

## ⚙️ Configuración Especial para Páginas Lentas

El proyecto está configurado para manejar aplicaciones con alta latencia:

- **Timeout global**: 240 segundos
- **Timeout de acciones**: 45 segundos
- **Timeout de navegación**: 75 segundos
- **Timeout de aserciones**: 30 segundos
- **Timeout a nivel de archivo**: 90 segundos

## 🏗️ Arquitectura y Mejores Prácticas

### Page Object Model (POM)
- **BasePage**: Clase base con funcionalidad común
- **LoginPage**: POM específico para la página de login
- **HomePage**: POM para la página principal

### Fixtures Personalizados
- **web-fixtures.ts**: Configura page objects y contextos específicos
- **authenticatedTest**: Extiende con estado autenticado pre-configurado
- **slowPageTest**: Configurado con timeouts extendidos

### Utilidades
- **TestUtils**: Clase con métodos auxiliares para testing
- Generación de datos aleatorios
- Logs estructurados
- Utilidades de fecha y strings

## 🌐 URLs y Configuración

- **URL de Login**: `http://localhost:9002/login`
- **URL Principal**: `http://localhost:9002/`
- **Navegador Requerido**: Google Chrome
- **Credenciales de Test**:
  - Email: `testing.skills@globant.com`
  - Password: `testing123`

## 📊 Reportes y Artifacts

Los tests generan los siguientes artifacts:

- **Reporte HTML**: `playwright-report/index.html`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`
- **Trace files**: `test-results/trace/`
- **JSON results**: `test-results/results.json`

## 🛠️ Comandos Útiles

### Lint y Type Check
```bash
npm run lint
npm run type-check
```

### Limpieza de artifacts
```bash
npx playwright test --clean
```

### Actualizar snapshots
```bash
npx playwright test --update-snapshots
```

## 🐛 Debug y Troubleshooting

### Modo Debug con puntos de interrupción
```bash
npx playwright test --debug
```

### Ejecución paso a paso
```bash
npx playwright test --debugger
```

### Logs verbosos
```bash
DEBUG=pw:api npx playwright test
```

## 🚨 Consideraciones Especiales

1. **Latencia Alta**: Los tests están optimizados para páginas con picos de latencia
2. **Sin Esperas Fijas**: Se utilizan aserciones con auto-reintento (web-first assertions)
3. **Estado Limpio**: Cada test limpia cookies y storage antes de ejecutarse
4. **Selectores Resilientes**: Uso de `getByRole`, `getByText` y seletores web-first

## 📝 Notas Adicionales

- El proyecto está configurado para ejecutarse exclusivamente en Google Chrome
- Los timeouts extendidos aseguran robustez en aplicaciones lentas
- La arquitectura POM facilita el mantenimiento y escalabilidad
- Los fixtures personalizados proporcionan contexto compartido entre tests