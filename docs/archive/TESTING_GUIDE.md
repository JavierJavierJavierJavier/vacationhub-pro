# Guía de Pruebas del Sistema de Emails

## ✅ Estado Actual del Sistema

El sistema está **completamente funcional** y listo para usar. Actualmente funciona en **modo desarrollo**, mostrando los emails en consola.

## 🧪 Pruebas Realizadas

### 1. Sistema de Recordatorios ✅
```bash
npm run test:reminders
```
**Resultado:** ✅ Funciona correctamente
- Detecta solicitudes que necesitan recordatorio (24h y 48h)
- Tracking de recordatorios funcionando
- Lógica de tiempo correcta

### 2. Configuración de Email ✅
```bash
npm run test:email
```
**Resultado:** ✅ Funciona en modo desarrollo
- Sin credenciales: Muestra emails en consola
- Con credenciales: Enviaría emails reales

## 📋 Checklist de Pruebas Manuales

### Prueba 1: Crear Solicitud y Verificar Email a Admins

1. **Inicia el servidor:**
   ```bash
   npm run dev:server
   ```

2. **Inicia el frontend:**
   ```bash
   npm run dev
   ```

3. **Crea una solicitud:**
   - Inicia sesión como empleado (ej: javier.ruiz@alter-5.com)
   - Ve a Dashboard → Nueva Solicitud
   - Completa el formulario y envía

4. **Verifica en consola del servidor:**
   Deberías ver:
   ```
   📧 [DEV MODE] Email que se enviaría:
   To: miguel.solana@alter-5.com, salvador.carrillo@alter-5.com
   Subject: Nueva solicitud de vacaciones - Javier Ruiz Balado
   Body: [contenido del email]
   ```

### Prueba 2: Aprobar Solicitud y Verificar Email al Empleado

1. **Inicia sesión como admin:**
   - miguel.solana@alter-5.com o salvador.carrillo@alter-5.com

2. **Ve a Aprobaciones:**
   - Deberías ver la solicitud pendiente

3. **Aprueba la solicitud:**
   - Click en "Aprobar"

4. **Verifica en consola del servidor:**
   Deberías ver:
   ```
   📧 [DEV MODE] Email que se enviaría:
   To: javier.ruiz@alter-5.com
   Subject: ✅ Tu solicitud de vacaciones ha sido aprobada
   Body: [contenido del email de aprobación]
   ```

### Prueba 3: Rechazar Solicitud y Verificar Email

1. **Crea otra solicitud** (como empleado)

2. **Recházala** (como admin) con un motivo

3. **Verifica en consola:**
   Deberías ver el email de rechazo con el motivo

### Prueba 4: Recordatorios Automáticos

Los recordatorios se envían automáticamente:
- **Primer recordatorio:** 24 horas después de crear la solicitud
- **Segundo recordatorio:** 48 horas después (24h después del primero)

**Para probar inmediatamente** (solo desarrollo):
1. Modifica temporalmente `server/reminderScheduler.js` línea 100:
   ```javascript
   // Cambiar de cada hora a cada minuto para testing
   cron.schedule('* * * * *', () => {  // Cada minuto
   ```

2. Crea una solicitud con fecha de hace 25 horas (modifica `requestDate` en el código)

3. Espera 1 minuto y verifica la consola

**⚠️ IMPORTANTE:** Vuelve a cambiar a `'0 * * * *'` después de probar

## 🔧 Configuración para Producción

### Paso 1: Obtener Credenciales SMTP

**Opción A: Gmail**
1. Ve a https://myaccount.google.com/apppasswords
2. Genera una contraseña de aplicación
3. Copia la contraseña (16 caracteres)

**Opción B: Mailtrap (Testing)**
1. Regístrate en https://mailtrap.io
2. Obtén credenciales SMTP de tu inbox

### Paso 2: Crear archivo .env

```bash
cp .env.example .env
```

Edita `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-16-caracteres
APP_URL=http://localhost:5173
PORT=4000
JWT_SECRET=tu-secret-key
```

### Paso 3: Verificar Configuración

```bash
npm run test:email
```

Deberías ver:
```
✅ Servidor de email listo
✅ Email enviado correctamente!
```

## 📊 Flujo Completo de Prueba

### Escenario Completo:

1. **Empleado crea solicitud** → Admins reciben email ✅
2. **Espera 24 horas** → Admins reciben primer recordatorio ✅
3. **Espera otras 24 horas** → Admins reciben segundo recordatorio ✅
4. **Admin aprueba** → Empleado recibe email de aprobación ✅
5. **Recordatorios se detienen** automáticamente ✅

## 🐛 Troubleshooting

### Los emails no aparecen en consola
- Verifica que el servidor esté corriendo
- Verifica que hayas creado la solicitud correctamente
- Revisa la consola del servidor (no del frontend)

### Los recordatorios no se envían
- El scheduler verifica cada hora
- Espera al menos 1 hora después de crear la solicitud
- Verifica que el servidor esté corriendo continuamente

### Error de credenciales SMTP
- Verifica que `.env` tenga las credenciales correctas
- Para Gmail, usa "Contraseña de aplicación", no tu contraseña normal
- Verifica que la verificación en 2 pasos esté activada

## ✅ Estado Final

- ✅ Sistema de emails implementado
- ✅ Recordatorios automáticos funcionando
- ✅ Modo desarrollo activo (emails en consola)
- ✅ Listo para producción (solo falta configurar credenciales SMTP)
- ✅ Documentación completa disponible

## 📝 Próximos Pasos

1. **Para desarrollo:** El sistema ya funciona perfectamente en modo desarrollo
2. **Para producción:** 
   - Configura credenciales SMTP en `.env`
   - Ejecuta `npm run test:email` para verificar
   - El sistema enviará emails reales automáticamente

