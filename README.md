# VacationHub Pro

Sistema de gestión de ausencias y vacaciones para Alter5.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
npm install
```

### Desarrollo

**IMPORTANTE**: Necesitas arrancar **dos servidores** en terminales separadas:

#### Terminal 1: Backend (API de autenticación)
```bash
npm run dev:server
```
Esto arranca el servidor Express en `http://localhost:4000`

#### Terminal 2: Frontend (Vite)
```bash
npm run dev
```
Esto arranca el servidor de desarrollo de Vite (normalmente en `http://localhost:5173`)

### Acceso

Una vez ambos servidores estén corriendo:
- Abre tu navegador en la URL que muestra Vite (normalmente `http://localhost:5173`)
- El frontend hará proxy automático de las peticiones `/api/*` al backend en el puerto 4000

## 📁 Estructura del Proyecto

```
vacationhub-pro/
├── src/                    # Código fuente del frontend
│   ├── components/        # Componentes React
│   │   ├── features/     # Componentes de funcionalidades
│   │   ├── layout/       # Componentes de layout
│   │   └── ui/           # Componentes UI reutilizables
│   ├── context/           # Contextos (Auth, Requests, Toast)
│   ├── data/              # Datos estáticos (empleados, tipos de ausencia)
│   ├── domain/            # Tipos de dominio compartidos
│   ├── hooks/             # Hooks personalizados
│   ├── pages/             # Páginas principales
│   └── utils/             # Utilidades (cálculos, fechas)
├── server/                 # Backend Express
│   ├── config.js          # Configuración del servidor
│   ├── authRoutes.js      # Rutas de autenticación
│   ├── reportRoutes.js    # Rutas de reportes
│   ├── authMiddleware.js  # Middleware JWT
│   ├── reportUtils.js     # Utilidades de reporting
│   └── API.md             # Documentación de la API
└── dist/                   # Build de producción (generado)
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Arranca el servidor de desarrollo de Vite (frontend)
- `npm run dev:server` - Arranca el servidor Express (backend)
- `npm run build` - Genera el build de producción
- `npm run test` - Ejecuta los tests
- `npm run test:watch` - Ejecuta los tests en modo watch
- `npm run import:users` - Importa usuarios desde CSV (ver `IMPORTAR_USUARIOS.md`)

## 🧪 Tests

El proyecto incluye una suite completa de tests:

### Tests Unitarios
- **Componentes UI**: Button, Modal, Card, Badge, FilterBar
- **Utilidades**: `calculations.ts`, `dateUtils.ts`
- **Contextos**: `AuthContext`, `RequestContext`

### Tests E2E
- Flujo de login completo
- Creación de solicitudes
- Validaciones de formularios

```bash
npm run test
```

**Cobertura actual**: 54+ tests pasando

## 📝 Tecnologías

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend**: Express, JWT
- **Testing**: Vitest, Testing Library
- **Routing**: React Router v6

## 🔐 Autenticación

El sistema usa JWT con contraseñas hasheadas en PostgreSQL. En producción es obligatorio definir `JWT_SECRET`.

Ver [server/API.md](./server/API.md) para documentación completa de la API.

## 📦 Build de Producción

```bash
npm run build
```

El resultado se genera en la carpeta `dist/`.

## 🎯 Funcionalidades Principales

### Para Empleados
- ✅ Dashboard personalizado con balance de vacaciones
- ✅ Solicitud de ausencias con validaciones inteligentes
- ✅ Calendario personal con todas las solicitudes
- ✅ Histórico completo de solicitudes con filtros avanzados
- ✅ Búsqueda y filtrado por tipo, estado, año
- ✅ Vista de disponibilidad del equipo

### Para Administradores
- ✅ Dashboard administrativo con métricas clave
- ✅ Aprobación/rechazo de solicitudes
- ✅ Vista global del calendario con filtros
- ✅ Gestión de equipos con detalles por empleado
- ✅ Reportes y exportación CSV
- ✅ Análisis de uso por departamento

### Funcionalidades Avanzadas
- ✅ **Carry-over**: Días no utilizados se arrastran al año siguiente (máx. 5 días)
- ✅ **Análisis inteligente**: Alertas sobre cobertura del equipo
- ✅ **Validaciones**: Antelación mínima, días consecutivos máximos
- ✅ **Filtros avanzados**: Por equipo, persona, tipo, estado, año

## 📊 Calidad del Código

- ✅ **TypeScript**: Migración gradual a TypeScript para type safety
- ✅ **Tests**: 54+ tests con cobertura de componentes críticos
- ✅ **Linting**: Sin errores de lint
- ✅ **Build**: Compilación exitosa sin warnings
- ✅ **Documentación**: API completamente documentada

## 🔄 Migración a TypeScript

El proyecto está en proceso de migración gradual a TypeScript:
- ✅ Contextos migrados (`AuthContext`, `RequestContext`, `ToastContext`)
- ✅ Utilidades migradas (`calculations`, `dateUtils`)
- ✅ Hooks migrados (`useBalance`, `useTeamAvailability`, `useUserRequests`)
- ✅ Páginas: `Login.tsx` migrado
- 🔄 Páginas restantes: En proceso

## 📚 Documentación

- [API Backend](./server/API.md)
- [Deploy](./DEPLOY_GUIDE.md)
- [Checklist Producción](./CHECKLIST_PRODUCCION.md)
- [Importar Usuarios](./IMPORTAR_USUARIOS.md)
- [Seguridad](./docs/SECURITY_NOTES.md)
- [Arquitectura](./docs/ARCHITECTURE.md)

## 📄 Licencia

Propietario - Alter5 © 2025
