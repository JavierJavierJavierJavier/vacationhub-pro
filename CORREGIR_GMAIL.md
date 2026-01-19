# 🔧 Corregir Error de Gmail

## ❌ Error Detectado

El error dice: "Username and Password not accepted"

**Esto significa:** Las credenciales no están correctas.

---

## ✅ Solución: Verificar el Archivo .env

### Problemas Comunes:

1. **Espacios extra en la contraseña**
   - La contraseña de Gmail puede tener espacios: `abcd efgh ijkl mnop`
   - En el `.env` debe ir **SIN espacios**: `abcdefghijklmnop`
   - O con espacios pero entre comillas: `"abcd efgh ijkl mnop"`

2. **Email incorrecto**
   - Debe ser exactamente tu email de Gmail
   - Sin espacios antes o después

3. **Contraseña mal copiada**
   - Asegúrate de copiar los 16 caracteres completos
   - Sin caracteres extra

---

## 📝 Cómo Corregir:

### Opción 1: Sin Espacios (Recomendado)

En tu `.env`, la línea `SMTP_PASS` debe ser:

```env
SMTP_PASS=abcdefghijklmnop
```

(Sin espacios, solo los 16 caracteres juntos)

### Opción 2: Con Comillas

Si quieres mantener los espacios:

```env
SMTP_PASS="abcd efgh ijkl mnop"
```

(Con comillas dobles)

---

## ✅ Ejemplo Correcto:

```env
JWT_SECRET=Xt0SFuiCy/jPT5xA93BHDZVdOK/SYPL6b1EaR0S4Hdk=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=abcdefghijklmnop
APP_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

---

## 🔍 Verificar:

1. **Abre el archivo .env de nuevo:**
   ```bash
   open -a TextEdit /Users/javierruiz/Downloads/vacationhub-pro/.env
   ```

2. **Verifica:**
   - `SMTP_USER` tiene tu email correcto (sin espacios)
   - `SMTP_PASS` tiene la contraseña SIN espacios (o con comillas si tiene espacios)

3. **Guarda** (Cmd + S)

4. **Prueba de nuevo**

---

## 🎯 Siguiente Paso

**Después de corregir, avísame y probamos de nuevo.**

