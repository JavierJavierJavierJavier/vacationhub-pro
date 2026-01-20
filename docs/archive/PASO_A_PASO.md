# 🎯 Pasos Exactos - Sigue Esto en Orden

**Tiempo total: ~15 minutos**

---

## ✅ PASO 1: Obtener Contraseña de Gmail (5 minutos)

### ¿Qué es esto?
Para que la app pueda enviar emails, necesita una contraseña especial de Gmail.

### Instrucciones exactas:

1. **Abre tu navegador** y ve a:
   ```
   https://myaccount.google.com/apppasswords
   ```

2. **Si te pide iniciar sesión**, inicia sesión con tu cuenta de Gmail

3. **Si ves un mensaje que dice "No puedes usar contraseñas de aplicaciones"**:
   - Primero necesitas activar la verificación en 2 pasos
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en 2 pasos" (toma 2 minutos)
   - Luego vuelve a: https://myaccount.google.com/apppasswords

4. **Cuando estés en la página de "Contraseñas de aplicaciones"**:
   - En "Seleccionar app": Elige **"Correo"**
   - En "Seleccionar dispositivo": Elige **"Otro (personalizado)"**
   - Escribe: **"VacationHub"**
   - Click en **"Generar"**

5. **Te aparecerá una contraseña de 16 caracteres** (algo como: `abcd efgh ijkl mnop`)
   - **CÓPIALA COMPLETA** (incluyendo los espacios, o sin espacios, da igual)
   - **GUÁRDALA** - la necesitarás en el Paso 3

**✅ Listo cuando:** Tienes una contraseña de 16 caracteres copiada.

---

## ✅ PASO 2: Crear Cuenta en Vercel (2 minutos)

### ¿Qué es Vercel?
Es donde vamos a poner el frontend (la parte que ven los usuarios).

### Instrucciones exactas:

1. **Abre tu navegador** y ve a:
   ```
   https://vercel.com
   ```

2. **Click en "Sign Up"** (arriba a la derecha)

3. **Click en "Continue with GitHub"** (el botón con el logo de GitHub)

4. **Autoriza Vercel** cuando GitHub te lo pida:
   - Click en "Authorize vercel"
   - Puede pedirte tu contraseña de GitHub

5. **Listo** - Ya estás dentro de Vercel

**✅ Listo cuando:** Puedes ver el dashboard de Vercel (pantalla principal).

---

## ✅ PASO 3: Crear Cuenta en Railway (2 minutos)

### ¿Qué es Railway?
Es donde vamos a poner el backend (la parte que procesa datos).

### Instrucciones exactas:

1. **Abre tu navegador** y ve a:
   ```
   https://railway.app
   ```

2. **Click en "Start a New Project"** o "Login"

3. **Click en "Login with GitHub"** (el botón con el logo de GitHub)

4. **Autoriza Railway** cuando GitHub te lo pida:
   - Click en "Authorize Railway"
   - Puede pedirte tu contraseña de GitHub

5. **Listo** - Ya estás dentro de Railway

**✅ Listo cuando:** Puedes ver el dashboard de Railway (pantalla principal).

---

## ✅ PASO 4: Crear Archivo .env (3 minutos)

### ¿Qué es esto?
Un archivo donde guardamos las credenciales de forma segura.

### Instrucciones exactas:

1. **Abre Terminal** (en Mac: Cmd + Espacio, escribe "Terminal", Enter)

2. **Ve a la carpeta del proyecto:**
   ```bash
   cd /Users/javierruiz/Downloads/vacationhub-pro
   ```

3. **Crea el archivo .env:**
   ```bash
   touch .env
   ```

4. **Abre el archivo .env con un editor:**
   ```bash
   open -a TextEdit .env
   ```
   
   (O si prefieres, ábrelo con tu editor favorito)

5. **Copia y pega esto en el archivo:**
   ```env
   JWT_SECRET=Xt0SFuiCy/jPT5xA93BHDZVdOK/SYPL6b1EaR0S4Hdk=
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=TU_EMAIL_AQUI@gmail.com
   SMTP_PASS=LA_CONTRASEÑA_DE_GMAIL_AQUI
   APP_URL=http://localhost:5173
   PORT=4000
   NODE_ENV=development
   ```

6. **Reemplaza:**
   - `TU_EMAIL_AQUI@gmail.com` → Tu email de Gmail (el que usaste en el Paso 1)
   - `LA_CONTRASEÑA_DE_GMAIL_AQUI` → La contraseña de 16 caracteres que copiaste en el Paso 1

7. **Guarda el archivo** (Cmd + S)

**✅ Listo cuando:** Tienes el archivo `.env` guardado con tus datos reales.

---

## ✅ PASO 5: Probar que Funciona Localmente (3 minutos)

### ¿Por qué?
Para asegurarnos de que todo funciona antes de deployar.

### Instrucciones exactas:

1. **Abre Terminal** (si no lo tienes abierto)

2. **Ve a la carpeta del proyecto:**
   ```bash
   cd /Users/javierruiz/Downloads/vacationhub-pro
   ```

3. **Inicia el backend** (en una terminal):
   ```bash
   npm run dev:server
   ```
   
   Deberías ver algo como:
   ```
   Auth API listening on http://localhost:4000
   ✅ Servidor de email listo
   📅 Scheduler de recordatorios iniciado
   ```

4. **Abre OTRA terminal** (nueva ventana de Terminal)

5. **En la nueva terminal, inicia el frontend:**
   ```bash
   cd /Users/javierruiz/Downloads/vacationhub-pro
   npm run dev
   ```
   
   Deberías ver algo como:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

6. **Abre tu navegador** y ve a:
   ```
   http://localhost:5173
   ```

7. **Prueba hacer login:**
   - Email: `javier.ruiz@alter-5.com`
   - Password: `OcPHn41$PTRr`
   - Deberías poder entrar

**✅ Listo cuando:** Puedes hacer login y ver el dashboard.

---

## 🎯 Checklist Final

Antes de continuar, verifica que tienes:

- [ ] Contraseña de Gmail obtenida (16 caracteres)
- [ ] Cuenta Vercel creada y puedo entrar
- [ ] Cuenta Railway creada y puedo entrar
- [ ] Archivo `.env` creado con:
  - [ ] Mi email de Gmail
  - [ ] Contraseña de aplicación de Gmail
  - [ ] JWT_SECRET (ya está puesto)
- [ ] La app funciona localmente (puedo hacer login)

---

## ✅ Cuando Termines Todos los Pasos

**Avísame diciendo:**
- "Ya terminé todos los pasos"
- O si tienes algún problema, dime en qué paso estás atascado

**Luego yo te guío en:**
1. Subir el código a GitHub
2. Deploy en Railway (backend)
3. Deploy en Vercel (frontend)
4. Conectar todo
5. Probar que funciona en producción

---

## 🆘 Si Tienes Problemas

**Paso 1 (Gmail):**
- Si no ves "Contraseñas de aplicaciones": Activa verificación en 2 pasos primero
- Si no funciona: Dime y te doy alternativa

**Paso 2-3 (Vercel/Railway):**
- Si no puedes autorizar: Verifica que estás logueado en GitHub
- Si tienes problemas: Dime exactamente qué error ves

**Paso 4 (.env):**
- Si no sabes crear el archivo: Dime y te doy el comando exacto
- Si tienes dudas: Pregúntame

**Paso 5 (Probar):**
- Si el backend no inicia: Revisa que el `.env` está bien
- Si el frontend no carga: Verifica que el backend está corriendo
- Si no puedes hacer login: Revisa los logs en la terminal

---

## ⏱️ Tiempo Estimado

- Paso 1: 5 minutos
- Paso 2: 2 minutos
- Paso 3: 2 minutos
- Paso 4: 3 minutos
- Paso 5: 3 minutos

**Total: ~15 minutos**

---

**¡Vamos paso a paso! Empieza con el Paso 1 y avísame cuando termines cada uno. 🚀**

