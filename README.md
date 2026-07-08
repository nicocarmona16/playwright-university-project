# Playwright University Project — Automation Testing Framework

Framework de pruebas automatizadas E2E para la aplicación **New Generation eCards** (plataforma de gestión de trainees de Globant), desarrollado con Playwright + TypeScript siguiendo las mejores prácticas de Page Object Model (POM), fixtures personalizados y reportes con Allure.

## 📁 Estructura del Proyecto

```
playwright-university-project/
├── fixtures/
│   └── web-fixtures.ts              # Fixtures personalizados (page objects + authenticated state)
├── pages/
│   ├── BasePage.ts                  # Clase abstracta base para todos los Page Objects
│   ├── LoginPage.ts                 # POM - Página de Login (/login)
│   ├── HomePage.ts                  # POM - Página principal (/)
│   ├── TraineeSearchPage.ts         # POM - Búsqueda y filtros de trainees (/)
│   ├── TraineeProfileSheetPage.ts   # POM - Sheet lateral de perfil de trainee
│   ├── TraineeMyProfilePage.ts      # POM - Mi Perfil del trainee (/trainee/profile)
│   ├── NotFoundPage.ts             # POM - Página 404
│   └── AccessControlPage.ts        # POM - Verificación de acceso denegado (/admin/*)
├── tests/
│   └── web/
│       ├── login.spec.ts            # Tests de autenticación (2 escenarios)
│       ├── trainee-search.spec.ts   # Tests de búsqueda y filtros (4 escenarios)
│       ├── trainee-profile-sheet.spec.ts  # Tests del profile sheet (4 escenarios)
│       ├── trainee-profile-edit.spec.ts   # Tests de edición de perfil (4 escenarios)
│       ├── not-found.spec.ts        # Tests de página 404 (3 escenarios)
│       └── access-control.spec.ts   # Tests de control de acceso (5 escenarios)
├── utils/
│   └── TestUtils.ts                 # Utilidades: logging, generación de datos, screenshots
├── .github/
│   └── workflows/
│       └── playwright.yml           # CI/CD pipeline (GitHub Actions)
├── playwright.config.ts             # Configuración de Playwright + reporters
├── package.json                     # Dependencias y scripts
├── tsconfig.json                    # Configuración de TypeScript
├── .env.example                     # Template de variables de entorno
└── .gitignore                       # Archivos ignorados por Git
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ (LTS recomendado)
- Google Chrome instalado
- (Opcional) Allure CLI para reportes avanzados

### Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/nicocarmona16/playwright-university-project.git
cd playwright-university-project

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores de Playwright
npx playwright install chrome

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correctos si es necesario
```

### Variables de Entorno (.env)

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `BASE_URL` | URL base de la aplicación | `http://localhost:9002` |
| `TEST_EMAIL` | Email de la cuenta trainee de prueba | `testing.skills@globant.com` |
| `TEST_PASSWORD` | Password de la cuenta de prueba | `testing123` |
| `LOGIN_TIMEOUT` | Timeout para operaciones de login (ms) | `90000` |
| `NAVIGATION_TIMEOUT` | Timeout para navegación (ms) | `30000` |
| `ELEMENT_WAIT_TIMEOUT` | Timeout para esperar elementos (ms) | `10000` |
| `HEADLESS` | Ejecución sin ventana visible | `true` |
| `SLOWMO` | Delay entre acciones para debug (ms) | `0` |

## 🧪 Ejecución de Tests

### Comandos Principales

```bash
# Ejecutar todos los tests (22 escenarios)
npx playwright test

# Ejecutar por proyecto específico
npx playwright test --project=login-authentication
npx playwright test --project=trainee-search-filters
npx playwright test --project=trainee-profile-sheet
npx playwright test --project=trainee-profile-edit
npx playwright test --project=not-found-404
npx playwright test --project=access-control

# Ejecutar un escenario específico por nombre
npx playwright test --grep "ESCENARIO 1: Successful Login"

# Ejecutar con ventana visible
npx playwright test --headed

# Modo debug (paso a paso)
npx playwright test --debug

# UI Mode (interfaz interactiva)
npx playwright test --ui

# Code Generator (para grabar nuevos tests)
npx playwright codegen http://localhost:9002
```

### Ejecución Selectiva

```bash
# Solo tests que no requieren login
npx playwright test --project=not-found-404 --project=access-control

# Solo tests de perfil (requieren login)
npx playwright test --project=trainee-profile-edit

# Solo tests de la home page (búsqueda + sheet)
npx playwright test --project=trainee-search-filters --project=trainee-profile-sheet
```

## 📋 Tests Implementados (22 Escenarios)

### 🔐 Login Authentication (2 tests)
| # | Escenario | Severidad |
|---|-----------|-----------|
| 1 | Successful Login — credenciales válidas → redirect a home | Critical |
| 2 | Failed Login — credenciales inválidas → mensaje de error | Critical |

### 🔍 Trainee Search & Filters (4 tests)
| # | Escenario | Severidad |
|---|-----------|-----------|
| 1 | Búsqueda por Nombre o Skill ("Nicolas", "php") | Normal |
| 2 | Filtro Individual por Ubicación (Medellín) | Normal |
| 3 | Filtro Individual por Nivel de Inglés (B2) | Normal |
| 4 | Filtro por Múltiples Skills con lógica AND (Gherkin + TypeScript) | Normal |

### 👤 Trainee Profile Sheet (4 tests)
| # | Escenario | Severidad |
|---|-----------|-----------|
| 1 | Apertura del Profile Sheet al hacer click en "View Profile" | Normal |
| 2 | Verificación del contenido (Skills, Location, Languages, Summary, Links) | Normal |
| 3 | Verificación de secciones adicionales (Mentor, Internship, Projects, Training) | Minor |
| 4 | Cierre del Profile Sheet | Normal |

### ✏️ Trainee Profile Edit (4 tests)
| # | Escenario | Severidad |
|---|-----------|-----------|
| 1 | Navegación al perfil — Login → Click "My Profile" → Verificar datos | Critical |
| 2 | Entrar a modo edición — Click "Edit Profile" → Verificar textarea + botones | Critical |
| 3 | Editar Professional Summary, guardar y restaurar valor original | Critical |
| 4 | Cancelar edición — Verificar que cambios se descartan | Normal |

### 🚫 404 Not Found (3 tests)
| # | Escenario | Severidad |
|---|-----------|-----------|
| 1 | Ruta inexistente muestra página 404 con heading y descripción | Minor |
| 2 | La página 404 muestra la ruta intentada en `<code>` | Minor |
| 3 | Botón "Go back to Homepage" redirige al Home | Normal |

### 🛡️ Access Control (5 tests)
| # | Escenario | Severidad |
|---|-----------|-----------|
| 1 | /admin/dashboard sin login → Access Denied | Critical |
| 2 | /admin/trainees sin login → Access Denied | Critical |
| 3 | /admin/skills sin login → Access Denied | Critical |
| 4 | El sidebar de admin NO se muestra a usuarios no autenticados | Critical |
| 5 | Botón "Go Back to Homepage" redirige al Home desde Access Denied | Normal |

## 📊 Reportes

### Playwright HTML Report
```bash
# Se genera automáticamente tras la ejecución
npx playwright show-report
```

### Allure Report (Reporte Avanzado)
```bash
# Requisito: instalar Allure CLI
npm install -g allure-commandline

# Generar y abrir reporte en un paso
npm run allure:serve

# O paso a paso:
npm run allure:generate    # Genera allure-report/ desde allure-results/
npm run allure:open        # Abre el reporte en el browser

# Limpiar reportes anteriores
npm run allure:clean
```

### Otros Formatos
- **JSON**: `test-results/results.json` (para integraciones programáticas)
- **JUnit XML**: `test-results/results.xml` (para CI/CD tools como Jenkins)

## 🏗️ Arquitectura

### Page Object Model (POM)

```
BasePage (abstracta)
├── LoginPage          → /login
├── HomePage           → / (heading, elementos principales)
├── TraineeSearchPage  → / (búsqueda, filtros, cards)
├── TraineeProfileSheetPage → Sheet lateral (Radix Dialog)
├── TraineeMyProfilePage    → /trainee/profile (lectura + edición)
├── NotFoundPage       → Cualquier ruta inexistente
└── AccessControlPage  → /admin/* (sin autenticación)
```

**BasePage** proporciona:
- `goto(url)` — navegación
- `waitForPageLoad()` — espera de carga
- `takeScreenshot(name)` — captura con timestamp
- `waitForElement()`, `clickElement()`, `fillInput()`, `getText()` — interacciones base

### Fixtures Personalizados

| Fixture | Descripción |
|---------|-------------|
| `loginPage` | Instancia de LoginPage |
| `homePage` | Instancia de HomePage |
| `traineeSearchPage` | Instancia de TraineeSearchPage |
| `traineeProfileSheetPage` | Instancia de TraineeProfileSheetPage |
| `traineeMyProfilePage` | Instancia de TraineeMyProfilePage |
| `notFoundPage` | Instancia de NotFoundPage |
| `accessControlPage` | Instancia de AccessControlPage |
| `authenticatedTest` | Test con login pre-ejecutado |
| `slowPageTest` | Test con timeouts extendidos |

### Configuración de Proyectos

| Proyecto | Workers | Razón |
|----------|:-------:|-------|
| `trainee-search-filters` | 1 | Sequential — dropdowns interfieren entre sí |
| `trainee-profile-sheet` | 1 | Sequential — sheet requiere estado consistente |
| `trainee-profile-edit` | 1 | Sequential — login + edición con BD compartida |
| `login-authentication` | 4 | Parallel — tests independientes |
| `not-found-404` | 4 | Parallel — tests independientes |
| `access-control` | 4 | Parallel — tests independientes |

## ⚙️ Configuración de Timeouts

La aplicación target usa Firebase con conexiones persistentes que generan latencia. Los timeouts están calibrados para esto:

| Timeout | Valor | Propósito |
|---------|-------|-----------|
| Global | 240s | Timeout máximo por test |
| Action | 45s | Click, fill, select |
| Navigation | 75s | page.goto, waitForURL |
| Expect/Assertion | 30s | Auto-retry de assertions |

## 🔧 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Playwright | ^1.60.0 | Framework de testing E2E |
| TypeScript | ES2020 | Lenguaje tipado |
| Allure Reporter | ^3.0.7 | Reportes avanzados |
| dotenv | ^16.4.5 | Variables de entorno |
| Google Chrome | Latest | Navegador de ejecución |

## 🔄 CI/CD (GitHub Actions)

El pipeline se ejecuta automáticamente en push/PR a `main`/`master`:

1. Instala dependencias (`npm ci`)
2. Instala browsers (`npx playwright install --with-deps`)
3. Ejecuta todos los tests
4. Genera reporte Allure
5. Sube artifacts: `playwright-report/`, `allure-report/`, `allure-results/`

Los artifacts se retienen por 30 días y son descargables desde la pestaña Actions del repositorio.

## 🐛 Debug y Troubleshooting

```bash
# Modo debug interactivo (abre inspector de Playwright)
npx playwright test --debug

# UI Mode (timeline visual de ejecución)
npx playwright test --ui

# Logs verbosos de la API de Playwright
DEBUG=pw:api npx playwright test

# Ver trace de un test fallido
npx playwright show-trace test-results/artifacts/.../trace.zip

# Listar todos los tests sin ejecutar
npx playwright test --list
```

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| `Chrome not found` | `npx playwright install chrome` |
| Tests timeout en Firebase | Aumentar `waitForTimeout()` en beforeEach |
| `localStorage` SecurityError | Navegar a una URL válida antes de `page.evaluate()` |
| Conflicto versiones Playwright | `rm -rf node_modules && npm install` |
| Toast no detectado | Verificar exit de edit mode como alternativa |

## 📝 Convenciones del Proyecto

- **Naming de tests**: `ESCENARIO N: Descripción breve`
- **Naming de archivos**: `kebab-case.spec.ts`
- **Page Objects**: `PascalCase.ts`
- **Logs**: Todo test usa `TestUtils.log()` para trazabilidad
- **Auto-limpieza**: Tests que modifican BD restauran el estado original
- **Selectores**: Preferencia por `getByRole`, `getByText`, `locator` con atributos semánticos

## 🌐 Aplicación Target

**New Generation eCards** — Plataforma interna de Globant para gestión de trainees.

- **Tech Stack**: Next.js 14 + Firebase (Auth + Firestore) + Tailwind CSS + Radix UI
- **URL Local**: `http://localhost:9002`
- **Autenticación**: Firebase Auth (email/password, restringido a `@globant.com`)
- **Roles**: `admin` (panel de gestión) y `trainee` (perfil propio)
