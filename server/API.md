# VacationHub Pro - API Documentation

API REST para el sistema de gestión de ausencias y vacaciones.

## Base URL

```
http://localhost:4000/api
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. El token debe incluirse en el header `Authorization`:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Autenticación

#### `POST /api/login`

Autentica un usuario y devuelve un token JWT.

**Request Body:**
```json
{
  "email": "javier.ruiz@alter-5.com",
  "password": "OcPHn41$PTRr"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "sub": "e7",
    "email": "javier.ruiz@alter-5.com",
    "name": "Javier Ruiz Balado",
    "deptId": "sales",
    "role": "employee"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Email y contraseña requeridos"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "error": "Email no encontrado"
}
```

o

```json
{
  "success": false,
  "error": "Contraseña incorrecta"
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"javier.ruiz@alter-5.com","password":"OcPHn41$PTRr"}'
```

---

### Reportes

#### `GET /api/reports/departments`

Obtiene estadísticas de uso de vacaciones por departamento.

**Query Parameters:**
- `year` (opcional): Año para el cual obtener las estadísticas. Por defecto: año actual.

**Ejemplo:**
```
GET /api/reports/departments?year=2025
```

**Response (200):**
```json
{
  "year": 2025,
  "policies": {
    "vacationDaysPerYear": 24,
    "carryOverLimit": 5
  },
  "departments": [
    {
      "id": "tech",
      "name": "Tech Team",
      "color": "#6366F1",
      "icon": "💻",
      "employeeCount": 4,
      "totalDays": 96,
      "usedDays": 45,
      "pendingDays": 10,
      "usagePercent": 47
    },
    {
      "id": "sales",
      "name": "Deal Origination & Sales",
      "color": "#F59E0B",
      "icon": "📈",
      "employeeCount": 3,
      "totalDays": 72,
      "usedDays": 30,
      "pendingDays": 5,
      "usagePercent": 42
    }
  ]
}
```

**Ejemplo con cURL:**
```bash
curl http://localhost:4000/api/reports/departments?year=2025
```

---

#### `GET /api/reports/employees`

Obtiene el balance de vacaciones de todos los empleados.

**Query Parameters:**
- `year` (opcional): Año para el cual obtener los balances. Por defecto: año actual.

**Ejemplo:**
```
GET /api/reports/employees?year=2025
```

**Response (200):**
```json
{
  "year": 2025,
  "employees": [
    {
      "id": "e7",
      "name": "Javier Ruiz Balado",
      "email": "javier.ruiz@alter-5.com",
      "deptId": "sales",
      "balance": {
        "year": 2025,
        "total": 28,
        "used": 16,
        "pending": 0,
        "carryOver": 4,
        "available": 12
      }
    },
    {
      "id": "e1",
      "name": "Leandro Pili",
      "email": "leandro.pili@alter-5.com",
      "deptId": "tech",
      "balance": {
        "year": 2025,
        "total": 29,
        "used": 0,
        "pending": 0,
        "carryOver": 5,
        "available": 29
      }
    }
  ]
}
```

**Ejemplo con cURL:**
```bash
curl http://localhost:4000/api/reports/employees?year=2025
```

---

## Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Credenciales inválidas o token faltante
- `403 Forbidden`: Token válido pero sin permisos
- `500 Internal Server Error`: Error del servidor

---

## Estructura del Token JWT

El token JWT contiene el siguiente payload:

```json
{
  "sub": "e7",
  "email": "javier.ruiz@alter-5.com",
  "name": "Javier Ruiz Balado",
  "deptId": "sales",
  "role": "employee",
  "iat": 1234567890,
  "exp": 1234595690
}
```

**Campos:**
- `sub`: ID del empleado
- `email`: Email del empleado
- `name`: Nombre completo
- `deptId`: ID del departamento
- `role`: Rol (`employee` o `admin`)
- `iat`: Fecha de emisión (timestamp)
- `exp`: Fecha de expiración (timestamp, 8 horas después de la emisión)

---

## Notas de Implementación

### Seguridad

⚠️ **IMPORTANTE**: Esta API es para desarrollo/demo. En producción:

1. **JWT_SECRET**: Debe estar en variables de entorno y ser una cadena segura y aleatoria
2. **Contraseñas**: Deben estar hasheadas (bcrypt, argon2, etc.) y nunca almacenadas en texto plano
3. **Base de datos**: Reemplazar datos estáticos por una base de datos real
4. **Rate limiting**: Implementar límites de tasa para prevenir abusos
5. **HTTPS**: Usar siempre HTTPS en producción
6. **Validación**: Validar y sanitizar todas las entradas

### Variables de Entorno

```env
PORT=4000
JWT_SECRET=tu-secret-super-seguro-aqui
NODE_ENV=production
```

### Middleware de Autenticación

Para proteger rutas en el futuro, usar el middleware `authenticateJWT`:

```javascript
import { authenticateJWT } from './authMiddleware.js'

router.get('/protected-route', authenticateJWT, (req, res) => {
  // req.user contiene el payload del token
  res.json({ user: req.user })
})
```

---

## Ejemplos de Uso

### Flujo Completo de Autenticación

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:4000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'javier.ruiz@alter-5.com',
    password: 'OcPHn41$PTRr'
  })
})

const { token, user } = await loginResponse.json()

// 2. Usar token en requests protegidos
const reportsResponse = await fetch('http://localhost:4000/api/reports/employees?year=2025', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const reports = await reportsResponse.json()
```

---

## Changelog

### v1.0.0
- Endpoint de login con JWT
- Endpoints de reportes (departments, employees)
- Soporte para carry-over de días de vacaciones
- Cálculo de balances por empleado y departamento

---

## Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.

