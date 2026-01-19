# 🔍 Diagnóstico Gmail - Paso a Paso

## ❌ Error Actual
"Username and Password not accepted"

---

## 🔍 Verificaciones Necesarias

### 1. Verificar que la Contraseña de Aplicación es Correcta

**Preguntas:**
- ¿Generaste la contraseña DESPUÉS de activar la verificación en 2 pasos?
- ¿La copiaste completa (16 caracteres)?
- ¿La contraseña tiene espacios? (ej: `abcd efgh ijkl mnop`)

**Solución si tiene espacios:**
- Opción A: Quitar espacios → `abcdefghijklmnop`
- Opción B: Poner entre comillas → `"abcd efgh ijkl mnop"`

### 2. Verificar el Email

**Preguntas:**
- ¿El email en `.env` es exactamente el mismo que usaste para generar la contraseña?
- ¿No tiene espacios antes o después?
- ¿Es un email de Gmail personal (no Workspace)?

### 3. Verificar el Formato del .env

El archivo debe tener exactamente este formato:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=abcdefghijklmnop
```

**Sin:**
- Espacios antes o después del `=`
- Comillas innecesarias (a menos que la contraseña tenga espacios)
- Líneas en blanco extra

---

## ✅ Pasos para Diagnosticar

### Paso 1: Verificar el Archivo .env

Ejecuta esto en Terminal para ver el formato (sin mostrar valores reales):

```bash
cd /Users/javierruiz/Downloads/vacationhub-pro
cat .env | grep SMTP
```

**Verifica:**
- No hay espacios antes del `=`
- No hay espacios después del `=`
- SMTP_PASS tiene exactamente 16 caracteres (sin contar espacios si los tiene)

### Paso 2: Generar Nueva Contraseña de Aplicación

A veces es más fácil empezar de cero:

1. Ve a: https://myaccount.google.com/apppasswords
2. Si ya tienes una para "VacationHub", **elimínala** primero
3. Genera una **nueva**:
   - App: Correo
   - Device: Otro (personalizado) → "VacationHub"
4. **Copia la nueva contraseña** (sin espacios, o con espacios pero luego la ponemos entre comillas)

### Paso 3: Actualizar .env con Nueva Contraseña

1. Abre: `open -a TextEdit /Users/javierruiz/Downloads/vacationhub-pro/.env`
2. Actualiza `SMTP_PASS` con la nueva contraseña
3. **Si la contraseña tiene espacios**, usa comillas:
   ```env
   SMTP_PASS="abcd efgh ijkl mnop"
   ```
4. **Si NO tiene espacios**, sin comillas:
   ```env
   SMTP_PASS=abcdefghijklmnop
   ```
5. Guarda

### Paso 4: Probar de Nuevo

```bash
npm run test:email
```

---

## 🎯 Prueba Rápida

Vamos a verificar el formato exacto de tu `.env`:

**Ejecuta esto y dime qué ves:**

```bash
cd /Users/javierruiz/Downloads/vacationhub-pro
echo "=== VERIFICACIÓN ===" && echo "" && echo "SMTP_USER:" && grep "^SMTP_USER=" .env | cut -d= -f2 | wc -c && echo "caracteres" && echo "" && echo "SMTP_PASS:" && grep "^SMTP_PASS=" .env | cut -d= -f2 | wc -c && echo "caracteres (debe ser 16 o 17 si tiene comillas)" && echo "" && echo "¿Tiene espacios SMTP_PASS?" && grep "^SMTP_PASS=" .env | grep -q " " && echo "SÍ" || echo "NO"
```

---

## 💡 Consejo

**Si sigue sin funcionar después de verificar todo:**
- Genera una contraseña NUEVA (elimina la anterior)
- Usa esa nueva contraseña
- Asegúrate de que el email sea exactamente el mismo

---

## ✅ Siguiente Paso

**Dime:**
1. ¿Quieres que verifique el formato de tu `.env`? (puedo hacerlo sin ver los valores)
2. ¿O prefieres generar una contraseña nueva y empezar de cero?

**Te guío en lo que prefieras.**

