# Guía de Configuración de Emails

## Paso 1: Configurar Credenciales SMTP

### Opción A: Gmail (Recomendado para producción)

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Activa la **Verificación en 2 pasos** si no está activada
3. Ve a **Contraseñas de aplicaciones**: https://myaccount.google.com/apppasswords
4. Genera una nueva contraseña para "Correo" y "Otro (personalizado)" → "VacationHub"
5. Copia la contraseña generada (16 caracteres)

### Opción B: Mailtrap (Recomendado para desarrollo/testing)

1. Regístrate en https://mailtrap.io (gratis)
2. Ve a "Email Testing" → "Inboxes"
3. Selecciona tu inbox y ve a "SMTP Settings"
4. Copia las credenciales

## Paso 2: Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Para Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-de-16-caracteres

# Para Mailtrap
# SMTP_HOST=smtp.mailtrap.io
# SMTP_PORT=2525
# SMTP_USER=tu-usuario-mailtrap
# SMTP_PASS=tu-password-mailtrap

APP_URL=http://localhost:5173
PORT=4000
JWT_SECRET=tu-secret-key-aqui
```

## Paso 3: Probar la Configuración

### Probar conexión de email:
```bash
npm run test:email
```

Deberías ver:
- ✅ Si las credenciales están correctas: "Email enviado correctamente!"
- ⚠️ Si no hay credenciales: Los emails se mostrarán en consola (modo desarrollo)

### Probar sistema de recordatorios:
```bash
npm run test:reminders
```

## Paso 4: Iniciar el Servidor

```bash
npm run dev:server
```

Verás:
- ✅ Servidor de email listo (si las credenciales están configuradas)
- 📅 Scheduler de recordatorios iniciado (cada hora)

## Paso 5: Probar el Sistema Completo

1. **Inicia el frontend:**
   ```bash
   npm run dev
   ```

2. **Inicia el backend:**
   ```bash
   npm run dev:server
   ```

3. **Crea una solicitud de vacaciones:**
   - Inicia sesión como empleado
   - Ve a Dashboard → Nueva Solicitud
   - Completa el formulario y envía

4. **Verifica los emails:**
   - **Con credenciales configuradas:** Revisa la bandeja de entrada de los admins
   - **Sin credenciales:** Revisa la consola del servidor donde verás el email que se enviaría

5. **Prueba los recordatorios:**
   - El scheduler verifica cada hora
   - Para probar inmediatamente, puedes modificar temporalmente `reminderScheduler.js` para usar intervalos más cortos (solo para testing)

## Verificación de Funcionamiento

### ✅ Checklist de Verificación

- [ ] Archivo `.env` creado con credenciales SMTP
- [ ] `npm run test:email` funciona correctamente
- [ ] `npm run test:reminders` muestra solicitudes correctamente
- [ ] Servidor inicia sin errores
- [ ] Al crear una solicitud, los admins reciben email
- [ ] Al aprobar/rechazar, el empleado recibe email
- [ ] Los recordatorios se programan correctamente

## Troubleshooting

### Error: "Invalid login"
- Verifica que `SMTP_USER` y `SMTP_PASS` sean correctos
- Para Gmail, asegúrate de usar una "Contraseña de aplicación", no tu contraseña normal

### Error: "Connection timeout"
- Verifica que `SMTP_HOST` y `SMTP_PORT` sean correctos
- Verifica tu conexión a internet
- Para Gmail, asegúrate de que "Permitir el acceso de aplicaciones menos seguras" esté desactivado (usa App Passwords)

### Los emails no se envían pero no hay error
- Revisa la consola del servidor para ver los logs
- En modo desarrollo (sin credenciales), los emails se muestran en consola
- Verifica que el servidor esté corriendo en el puerto correcto

### Los recordatorios no se envían
- El scheduler verifica cada hora, espera al menos 1 hora
- Verifica que el servidor esté corriendo continuamente
- Revisa los logs del servidor para ver si hay errores

## Modo Desarrollo (Sin Credenciales)

Si no configuras las credenciales SMTP, el sistema funcionará en "modo desarrollo":
- Los emails se mostrarán en la consola del servidor
- No se enviarán emails reales
- Perfecto para desarrollo y testing local

