# 🔧 Solución para Google Workspace (@alter-5.com)

## ⚠️ Problema Detectado

Tu cuenta es **Google Workspace** (`@alter-5.com`), no Gmail personal. Google Workspace puede tener restricciones adicionales que requieren configuración especial.

---

## ✅ SOLUCIÓN 1: Verificar Configuración del Administrador

**Google Workspace puede requerir que el administrador active las contraseñas de aplicación.**

### Pasos:

1. **Contacta al administrador de Google Workspace de Alter-5**

2. **Pídele que verifique:**
   - Que las "App Passwords" están habilitadas para tu organización
   - Que tu cuenta tiene permisos para generar contraseñas de aplicación
   - Que no hay políticas de seguridad bloqueando el acceso SMTP

3. **Si eres tú el administrador:**
   - Ve a: https://admin.google.com
   - Busca: "Seguridad" → "Configuración de API"
   - Verifica que "Contraseñas de aplicación" está habilitado

---

## ✅ SOLUCIÓN 2: Usar OAuth2 (Más Seguro)

**Google Workspace funciona mejor con OAuth2 que con contraseñas de aplicación.**

**Esto requiere más configuración pero es más seguro y confiable.**

**¿Quieres que te ayude a configurar OAuth2?** (Toma ~15 minutos)

---

## ✅ SOLUCIÓN 3: Usar Mailtrap (Rápido y Funcional)

**Para avanzar rápido mientras solucionamos Google Workspace:**

1. Ve a: https://mailtrap.io
2. Regístrate con GitHub (2 minutos)
3. Copia las credenciales SMTP
4. Te actualizo el `.env`
5. **¡Funciona inmediatamente!**

**Ventajas:**
- ✅ Funciona inmediatamente
- ✅ Perfecto para desarrollo y pruebas
- ✅ No requiere configuración especial
- ✅ Puedes ver todos los emails enviados

**Desventajas:**
- Los emails no se envían realmente (van a Mailtrap)
- Para producción necesitarás Gmail o otro servicio

---

## ✅ SOLUCIÓN 4: Verificar la Contraseña

**Asegúrate de que:**

1. ✅ La contraseña tiene exactamente **16 caracteres** (con espacios cuenta como 1)
2. ✅ La copiaste **completa** sin caracteres extra
3. ✅ La generaste **después** de activar 2-Step Verification
4. ✅ No hay espacios al principio o final

**Ejemplo correcto:**
```
wonl qjgf ggtw jmjr
```
(16 caracteres: w-o-n-l- -q-j-g-f- -g-g-t-w- -j-m-j-r)

---

## ✅ SOLUCIÓN 5: Probar con Gmail Personal (Temporal)

**Para verificar que el código funciona:**

1. Usa tu Gmail personal (`tu-email@gmail.com`)
2. Genera una contraseña de aplicación
3. Prueba con esa cuenta
4. Si funciona, el problema es específico de Google Workspace

---

## 🎯 RECOMENDACIÓN

**Para avanzar rápido:**

1. **Usa Mailtrap ahora** (2 minutos, funciona inmediatamente)
2. **Mientras tanto**, contacta al administrador de Google Workspace
3. **Configura OAuth2** para producción (más seguro y confiable)

---

## ❓ ¿Qué Prefieres Hacer?

1. **Usar Mailtrap** (rápido, funciona ahora)
2. **Configurar OAuth2** (más trabajo, más seguro)
3. **Contactar al administrador** de Google Workspace
4. **Probar con Gmail personal** (para verificar que funciona)

**Dime cuál prefieres y te guío paso a paso.**
