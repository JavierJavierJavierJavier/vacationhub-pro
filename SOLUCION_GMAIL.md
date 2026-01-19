# 🔧 Solución: Contraseñas de Aplicación de Gmail

## ❌ Problema: "La opción no está disponible para tu cuenta"

**Esto significa:** Necesitas activar la verificación en 2 pasos primero.

---

## ✅ SOLUCIÓN: Activar Verificación en 2 Pasos

### Paso 1: Activar Verificación en 2 Pasos

1. **Ve a:** https://myaccount.google.com/security

2. **Busca la sección "Cómo iniciar sesión en Google"**

3. **Busca "Verificación en 2 pasos"** y click en "Activar"

4. **Sigue los pasos:**
   - Te pedirá tu contraseña
   - Te pedirá un número de teléfono
   - Te enviará un código por SMS
   - Ingresa el código
   - Confirma

5. **Tiempo:** ~3 minutos

### Paso 2: Volver a Contraseñas de Aplicación

1. **Una vez activada la verificación en 2 pasos**, vuelve a:
   ```
   https://myaccount.google.com/apppasswords
   ```

2. **Ahora deberías poder generar la contraseña**

---

## 🔄 ALTERNATIVA: Si No Puedes Activar Verificación en 2 Pasos

Si por alguna razón no puedes activar la verificación en 2 pasos, tenemos alternativas:

### Opción A: Mailtrap (Para Testing - Gratis)

**Ventajas:** Gratis, fácil, perfecto para probar

1. Ve a: https://mailtrap.io
2. Regístrate (gratis)
3. Ve a "Email Testing" → "Inboxes"
4. Selecciona tu inbox
5. Ve a "SMTP Settings"
6. Copia las credenciales

**Usarías en `.env`:**
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu-usuario-mailtrap
SMTP_PASS=tu-password-mailtrap
```

### Opción B: SendGrid (Para Producción - Gratis hasta 100 emails/día)

**Ventajas:** Profesional, gratis tier generoso

1. Ve a: https://sendgrid.com
2. Regístrate (gratis)
3. Crea una API Key
4. Usa las credenciales SMTP

**Usarías en `.env`:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu-api-key-de-sendgrid
```

---

## 🎯 Recomendación

**Para empezar rápido:**
1. Intenta activar verificación en 2 pasos (3 min)
2. Si no puedes, usa **Mailtrap** (gratis, 2 min de setup)

**Para producción:**
- **SendGrid** o **Mailgun** (más profesional)

---

## ✅ Siguiente Paso

**Dime:**
1. ¿Pudiste activar la verificación en 2 pasos?
2. O ¿prefieres usar Mailtrap para empezar rápido?

**Cuando tengas las credenciales (de Gmail o Mailtrap), seguimos con el Paso 2.**

