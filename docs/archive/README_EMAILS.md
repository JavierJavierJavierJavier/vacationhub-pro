# Sistema de Notificaciones por Email

## Configuración

El sistema de notificaciones por email está completamente implementado. Para usarlo en producción, necesitas configurar las credenciales SMTP.

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
APP_URL=http://localhost:5173
PORT=4000
```

### Configuración de Gmail

1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación" en: https://myaccount.google.com/apppasswords
4. Usa esa contraseña en `SMTP_PASS`

### Servicios Alternativos para Desarrollo

- **Mailtrap**: https://mailtrap.io (para testing)
- **Ethereal Email**: Genera credenciales automáticamente para testing

## Funcionalidades

### 1. Notificación de Nueva Solicitud
Cuando un empleado solicita vacaciones:
- Se envía un email a todos los administradores
- El email incluye todos los detalles de la solicitud
- Se registra la solicitud para tracking de recordatorios

### 2. Recordatorios Automáticos
- **Primer recordatorio**: 24 horas después de la solicitud
- **Segundo recordatorio**: 48 horas después de la solicitud (24h después del primero)
- Los recordatorios se envían automáticamente cada hora (verificación)

### 3. Notificación de Aprobación
Cuando un admin aprueba una solicitud:
- Se envía un email al empleado confirmando la aprobación
- Se detienen los recordatorios automáticos

### 4. Notificación de Rechazo
Cuando un admin rechaza una solicitud:
- Se envía un email al empleado con el motivo del rechazo
- Se detienen los recordatorios automáticos

## Modo Desarrollo

Si no configuras las credenciales SMTP, el sistema funcionará en "modo desarrollo":
- Los emails se mostrarán en la consola del servidor
- No se enviarán emails reales
- Perfecto para desarrollo y testing

## Endpoints

- `POST /api/notifications/new-request` - Notificar nueva solicitud
- `POST /api/notifications/approved` - Notificar aprobación
- `POST /api/notifications/rejected` - Notificar rechazo
- `GET /api/notifications/requests` - Obtener todas las solicitudes (para scheduler)
- `POST /api/notifications/send-reminders` - Enviar recordatorios manualmente (testing)

## Scheduler

El scheduler de recordatorios se ejecuta automáticamente:
- Cada hora verifica si hay solicitudes que necesitan recordatorio
- Se inicia automáticamente al arrancar el servidor
- Los recordatorios se envían según las reglas (24h y 48h)

## Pruebas

### Probar TODO el sistema completo (Recomendado)
```bash
npm run test:full
```
Este comando ejecuta todas las pruebas:
- ✅ Creación de solicitud y notificación a admins
- ✅ Aprobación y notificación al empleado  
- ✅ Rechazo y notificación al empleado

### Probar configuración de email
```bash
npm run test:email
```

### Probar sistema de recordatorios
```bash
npm run test:reminders
```

### 📖 Guía Detallada
Ver `GUIA_PRUEBAS.md` para instrucciones paso a paso con capturas y ejemplos.

### Configurar credenciales SMTP

1. **Para Gmail:**
   - Ve a https://myaccount.google.com/apppasswords
   - Genera una contraseña de aplicación
   - Úsala en `SMTP_PASS`

2. **Para Mailtrap (desarrollo/testing):**
   - Regístrate en https://mailtrap.io
   - Obtén las credenciales SMTP
   - Configúralas en `.env`

3. **Crear archivo .env:**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales
   ```

