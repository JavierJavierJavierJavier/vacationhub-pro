# 🔄 Solución Alternativa: Usar Mailtrap (Más Fácil)

## ⚠️ Problema con Gmail

Si Gmail sigue dando error, podemos usar **Mailtrap** que es más fácil y funciona perfecto para empezar.

---

## ✅ Opción: Mailtrap (2 minutos)

### Ventajas:
- ✅ Más fácil de configurar
- ✅ Gratis
- ✅ Perfecto para testing
- ✅ No necesita verificación en 2 pasos

### Pasos:

1. **Ve a:** https://mailtrap.io
2. **Regístrate** (gratis, con GitHub o email)
3. **Ve a:** "Email Testing" → "Inboxes"
4. **Selecciona tu inbox** (o crea uno nuevo)
5. **Ve a:** "SMTP Settings"
6. **Copia las credenciales:**
   - Host: `smtp.mailtrap.io`
   - Port: `2525`
   - Username: (te lo da Mailtrap)
   - Password: (te lo da Mailtrap)

7. **Actualiza tu `.env`:**
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=tu-usuario-mailtrap
   SMTP_PASS=tu-password-mailtrap
   ```

8. **Prueba:**
   ```bash
   npm run test:email
   ```

---

## 🎯 Recomendación

**Para empezar rápido:** Usa Mailtrap (2 minutos, funciona seguro)

**Para producción después:** Configura Gmail o SendGrid

---

## ✅ ¿Qué Prefieres?

1. **Seguir intentando con Gmail** (puedo ayudarte a revisar)
2. **Usar Mailtrap** (más rápido, 2 minutos)

**Dime qué prefieres y te guío.**

