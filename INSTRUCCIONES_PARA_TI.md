# 👤 Instrucciones: Lo Que TÚ Tienes Que Hacer

**Total tiempo:** ~15 minutos  
**Dificultad:** Fácil (solo seguir pasos)

---

## ✅ Paso 1: Obtener Contraseña de Gmail (5 min)

### ¿Por qué?
Para que la aplicación pueda enviar emails.

### Pasos:
1. Ve a: https://myaccount.google.com/apppasswords
   - Si no tienes verificación en 2 pasos, actívala primero
2. Selecciona:
   - **App:** Correo
   - **Device:** Otro (personalizado) → Escribe "VacationHub"
3. Click en "Generar"
4. **Copia la contraseña de 16 caracteres** (ejemplo: `abcd efgh ijkl mnop`)
5. **Guárdala en un lugar seguro** - la necesitarás después

**✅ Listo cuando:** Tienes una contraseña de 16 caracteres copiada.

---

## ✅ Paso 2: Crear Cuenta en Vercel (2 min)

### ¿Por qué?
Para deployar el frontend (la parte que ven los usuarios).

### Pasos:
1. Ve a: https://vercel.com
2. Click en "Sign Up"
3. Elige "Continue with GitHub" (más fácil)
4. Autoriza Vercel
5. **Listo** - ya tienes cuenta

**✅ Listo cuando:** Puedes entrar a Vercel y ver tu dashboard.

---

## ✅ Paso 3: Crear Cuenta en Railway (2 min)

### ¿Por qué?
Para deployar el backend (la parte que procesa datos y envía emails).

### Pasos:
1. Ve a: https://railway.app
2. Click en "Start a New Project"
3. Elige "Login with GitHub"
4. Autoriza Railway
5. **Listo** - ya tienes cuenta

**✅ Listo cuando:** Puedes entrar a Railway y ver tu dashboard.

---

## ✅ Paso 4: Crear Archivo .env (1 min)

### ¿Por qué?
Para guardar tus credenciales de forma segura (no se sube a Git).

### Pasos:
1. En la raíz del proyecto (`/Users/javierruiz/Downloads/vacationhub-pro`)
2. Crea un archivo llamado exactamente: `.env`
3. Copia este contenido:

```env
# JWT Secret (yo te daré uno generado)
JWT_SECRET=GENERAR_CON_OPENSSL

# SMTP Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=TU_EMAIL_AQUI@gmail.com
SMTP_PASS=LA_CONTRASEÑA_DE_16_CARACTERES_DE_GMAIL

# URLs
APP_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

4. Reemplaza:
   - `TU_EMAIL_AQUI@gmail.com` → Tu email de Gmail
   - `LA_CONTRASEÑA_DE_16_CARACTERES_DE_GMAIL` → La contraseña del Paso 1
   - `GENERAR_CON_OPENSSL` → Te daré el comando para generarlo

**✅ Listo cuando:** Tienes el archivo `.env` con tus datos reales.

---

## ✅ Paso 5: Generar JWT Secret (30 segundos)

### ¿Por qué?
Para seguridad de la autenticación.

### Pasos:
1. Abre Terminal
2. Ejecuta:
```bash
openssl rand -base64 32
```
3. **Copia el resultado** (será algo largo)
4. Pégalo en `.env` donde dice `JWT_SECRET=`

**✅ Listo cuando:** Tienes un JWT_SECRET largo en tu `.env`.

---

## 🎯 Resumen: Checklist

- [ ] Contraseña de Gmail obtenida (16 caracteres)
- [ ] Cuenta Vercel creada
- [ ] Cuenta Railway creada
- [ ] Archivo `.env` creado con:
  - [ ] Tu email de Gmail
  - [ ] Contraseña de aplicación de Gmail
  - [ ] JWT_SECRET generado

**Cuando tengas todo esto, avísame y te guío en el deploy paso a paso.**

---

## ⏱️ Tiempo Total

- Paso 1: 5 minutos
- Paso 2: 2 minutos
- Paso 3: 2 minutos
- Paso 4: 1 minuto
- Paso 5: 30 segundos

**Total: ~10-15 minutos**

---

## 🆘 Si Tienes Problemas

**Paso 1 (Gmail):**
- Si no ves "Contraseñas de aplicaciones": Activa verificación en 2 pasos primero
- Si no funciona: Usa Mailtrap.io (gratis, para testing)

**Paso 2-3 (Vercel/Railway):**
- Si no tienes GitHub: Créalo primero (gratis, 2 min)
- Si tienes problemas: Dime y te ayudo

**Paso 4 (.env):**
- Si no sabes crear el archivo: Dime y te doy el comando exacto
- Si tienes dudas: Pregúntame

---

## ✅ Cuando Termines

**Avísame y yo:**
1. Te guío en el deploy paso a paso
2. Configuro la base de datos
3. Pruebo que todo funciona
4. Te doy la URL final para compartir con la empresa

**¡Vamos a hacerlo! 🚀**

