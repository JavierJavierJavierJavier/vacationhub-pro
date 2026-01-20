# 🚀 Quick Start - Sistema de Emails

## Configuración Rápida (5 minutos)

### 1. Crear archivo .env
```bash
cp .env.example .env
```

### 2. Configurar credenciales SMTP (Opcional)

**Para Gmail:**
1. Ve a https://myaccount.google.com/apppasswords
2. Genera contraseña de aplicación
3. Edita `.env`:
```env
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

**Sin credenciales (Modo Desarrollo):**
- El sistema funcionará mostrando emails en consola
- Perfecto para desarrollo y testing

### 3. Probar el Sistema

```bash
# Probar configuración de email
npm run test:email

# Probar sistema de recordatorios
npm run test:reminders

# Iniciar servidor
npm run dev:server

# En otra terminal, iniciar frontend
npm run dev
```

### 4. Crear una Solicitud de Prueba

1. Inicia sesión como empleado
2. Crea una solicitud de vacaciones
3. **Verifica en consola del servidor** - Verás el email que se enviaría a los admins

### 5. Aprobar/Rechazar

1. Inicia sesión como admin
2. Aprueba o rechaza la solicitud
3. **Verifica en consola** - Verás el email al empleado

## ✅ Verificación Rápida

- ✅ `npm run test:reminders` → Muestra solicitudes que necesitan recordatorio
- ✅ `npm run test:email` → Prueba envío de email
- ✅ Crear solicitud → Ver email en consola del servidor
- ✅ Aprobar/Rechazar → Ver email en consola del servidor

## 📧 Recordatorios Automáticos

- Se envían automáticamente cada hora
- Primer recordatorio: 24h después de la solicitud
- Segundo recordatorio: 48h después de la solicitud
- Se detienen automáticamente al aprobar/rechazar

## 🎯 Listo para Usar

El sistema está **100% funcional**:
- ✅ Emails a admins cuando se crea solicitud
- ✅ Emails a empleado cuando se aprueba/rechaza
- ✅ Recordatorios automáticos cada 24h
- ✅ Funciona en modo desarrollo (consola) y producción (emails reales)

