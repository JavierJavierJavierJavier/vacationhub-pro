# 🔐 Guía Súper Simple: Contraseñas de Gmail para Alter-5

## 🎯 ¿Qué Necesitamos?

**Una contraseña especial** para que la aplicación pueda enviar emails usando Gmail de Alter-5.

---

## 📝 PASO 1: Entender Qué Vamos a Hacer

Imagina que tu aplicación es como un robot que necesita enviar emails.
Para que el robot pueda usar tu cuenta de Gmail, necesitas darle una "llave especial" (contraseña de aplicación).

**Esta contraseña es diferente a tu contraseña normal.**

---

## 🚀 PASO 2: Activar la Seguridad Extra (2-Step Verification)

**Primero necesitas activar la "seguridad extra" en tu cuenta:**

1. **Abre tu navegador** (Chrome, Safari, etc.)

2. **Ve a:** https://myaccount.google.com/security

3. **Busca la sección que dice:** "Cómo iniciar sesión en Google"

4. **Busca:** "Verificación en 2 pasos" o "2-Step Verification"

5. **Click en:** "Activar" o "Get started"

6. **Sigue las instrucciones:**
   - Te pedirá tu contraseña normal
   - Te pedirá tu número de teléfono
   - Te enviará un código por SMS
   - Escribe el código que recibas
   - Click en "Activar"

✅ **¡Listo! Ya tienes la seguridad extra activada.**

---

## 🔑 PASO 3: Generar la Contraseña de Aplicación

**Ahora vamos a crear la "llave especial" para el robot:**

### Opción A: Si ves "Contraseñas de aplicación" directamente

1. **Ve a:** https://myaccount.google.com/apppasswords

2. **Si te pide que inicies sesión, inicia sesión con tu cuenta de Alter-5**

3. **Verás una pantalla que dice:** "Selecciona la app" y "Selecciona el dispositivo"

4. **En "Selecciona la app":**
   - Click en el menú desplegable
   - Busca y selecciona **"Otra (nombre personalizado)"**
   - Escribe: **"VacationHub"** o **"Sistema de Vacaciones"**

5. **En "Selecciona el dispositivo":**
   - Click en el menú desplegable
   - Selecciona **"Otro (nombre personalizado)"**
   - Escribe: **"Servidor"** o **"Backend"**

6. **Click en:** **"Generar"** o **"Generate"**

7. **¡Aparecerá una contraseña!** Se verá así:
   ```
   yhhm uktj ccch ilbl
   ```
   (16 letras y números, con espacios)

8. **¡COPIA ESTA CONTRASEÑA!** 
   - Selecciónala toda
   - Click derecho → Copiar
   - O Cmd+C (Mac) / Ctrl+C (Windows)

9. **Guárdala en un lugar seguro** (notas, documento, etc.)

---

### Opción B: Si NO ves "Contraseñas de aplicación"

**Esto pasa a veces con Google Workspace. Prueba esto:**

1. **Ve a:** https://myaccount.google.com/security

2. **Busca:** "Verificación en 2 pasos" o "2-Step Verification"

3. **Click en:** "Contraseñas de aplicación" o "App passwords"

4. **Si no aparece, intenta:**
   - Cerrar sesión y volver a iniciar
   - Usar un navegador diferente
   - Esperar unos minutos y volver a intentar

---

## 📧 PASO 4: ¿Cuántas Contraseñas Necesitas?

### Opción 1: Una Contraseña para Todos (RECOMENDADO) ⭐

**Usa UNA cuenta de email de Alter-5 para enviar todos los emails del sistema.**

**Ejemplo:**
- Email: `vacaciones@alter-5.com` o `noreply@alter-5.com`
- Generas UNA contraseña de aplicación para esta cuenta
- Todos los emails del sistema salen de esta cuenta

**✅ Ventajas:**
- Más fácil de gestionar
- Solo necesitas una contraseña
- Todos los emails vienen del mismo remitente

**📝 Pasos:**
1. Crea o usa una cuenta de Alter-5 (ej: `vacaciones@alter-5.com`)
2. Activa 2-Step Verification en esa cuenta
3. Genera UNA contraseña de aplicación
4. Úsala en el archivo `.env`

---

### Opción 2: Cada Empleado con Su Propia Contraseña

**Si quieres que cada empleado reciba emails desde su propia cuenta:**

**❌ Desventajas:**
- Cada empleado necesita generar su contraseña
- Más complicado de gestionar
- No tiene mucho sentido (todos los emails son del sistema)

**📝 Pasos (si realmente lo necesitas):**
1. Cada empleado debe:
   - Activar 2-Step Verification en su cuenta
   - Generar su contraseña de aplicación
   - Darte la contraseña

2. Tú guardas todas las contraseñas en un lugar seguro

3. Modificas el código para usar diferentes cuentas según el empleado

**⚠️ NO RECOMENDADO** porque es complicado y no aporta valor.

---

## ✅ PASO 5: Usar la Contraseña en el Archivo .env

**Una vez que tengas la contraseña:**

1. **Abre el archivo `.env`** en tu proyecto

2. **Busca estas líneas:**
   ```env
   SMTP_USER=tu-email@alter-5.com
   SMTP_PASS=tu-contraseña-aqui
   ```

3. **Reemplaza con tus datos:**
   ```env
   SMTP_USER=vacaciones@alter-5.com
   SMTP_PASS=yhhm uktj ccch ilbl
   ```
   (Pega la contraseña EXACTAMENTE como aparece, con espacios)

4. **Guarda el archivo**

5. **Prueba:** `npm run test:email`

---

## 🎯 RESUMEN: Qué Hacer Ahora

### Si Eres el Administrador del Sistema:

1. ✅ **Crea o usa una cuenta de email de Alter-5** (ej: `vacaciones@alter-5.com`)

2. ✅ **Activa 2-Step Verification** en esa cuenta

3. ✅ **Genera UNA contraseña de aplicación**

4. ✅ **Pégala en el archivo `.env`**

5. ✅ **Prueba:** `npm run test:email`

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar mi email personal?
**Sí**, pero es mejor usar un email de la empresa (`@alter-5.com`).

### ¿Necesito una contraseña por cada empleado?
**No**, solo necesitas UNA contraseña para enviar todos los emails.

### ¿Qué pasa si olvido la contraseña?
**No pasa nada**, puedes generar una nueva y borrar la antigua.

### ¿Es seguro?
**Sí**, es muy seguro. La contraseña de aplicación solo funciona para enviar emails, no puede cambiar tu contraseña ni acceder a tu cuenta.

---

## 🆘 Si Algo No Funciona

1. **Verifica que activaste 2-Step Verification**
2. **Verifica que la contraseña tiene exactamente 16 caracteres** (con espacios)
3. **Verifica que copiaste la contraseña completa**
4. **Prueba generar una nueva contraseña**

---

## 📞 ¿Necesitas Ayuda?

**Dime:**
- ¿Qué paso te quedó atascado?
- ¿Qué mensaje de error ves?
- ¿Ya activaste 2-Step Verification?

**Y te ayudo paso a paso.**
