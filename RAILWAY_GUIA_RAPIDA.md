# ⚡ Railway - Guía Rápida (10 Minutos)

## 🎯 Lo que Necesitas Hacer TÚ:

### 1️⃣ Crear Cuenta Railway (2 min)
1. Ve a: **https://railway.app**
2. Click: **"Start a New Project"**
3. Elige: **"Sign Up with GitHub"**
4. Autoriza Railway

### 2️⃣ Crear PostgreSQL (2 min)
1. En Railway: **"New Project"**
2. Click: **"Provision PostgreSQL"**
3. Espera ~30 segundos

### 3️⃣ Copiar Credenciales (1 min)
1. Click en la **base de datos PostgreSQL**
2. Ve a pestaña **"Variables"**
3. **Copia estas 5 variables:**
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### 4️⃣ Conectar Repositorio (2 min)
1. Vuelve al **proyecto principal**
2. Click: **"New Service"** → **"GitHub Repo"**
3. Selecciona: **vacationhub-pro**
4. Railway detectará Node.js automáticamente

### 5️⃣ Configurar Variables (2 min)
1. En el servicio, ve a **"Variables"**
2. **Agrega estas variables** (pega las que copiaste antes):

```
DB_HOST=<PGHOST>
DB_PORT=<PGPORT>
DB_NAME=<PGDATABASE>
DB_USER=<PGUSER>
DB_PASSWORD=<PGPASSWORD>
DB_SSL=true
JWT_SECRET=<genera uno aleatorio, ej: openssl rand -hex 32>
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<tu username de Mailtrap>
SMTP_PASS=<tu password de Mailtrap>
APP_URL=<se llenará automáticamente después del deploy>
PORT=4000
NODE_ENV=production
```

### 6️⃣ Ejecutar Migración (1 min)
1. Ve a **"Deployments"**
2. Click en el **último deployment**
3. Click en **"View Logs"**
4. O ejecuta manualmente: `railway run node server/migrate.js`

### 7️⃣ Obtener URL (1 min)
1. Ve a **"Settings"**
2. Click: **"Generate Domain"**
3. **Copia la URL** (ej: `https://vacationhub-production.up.railway.app`)
4. **Actualiza** `APP_URL` con esta URL

---

## ✅ ¡Listo!

Tu aplicación está corriendo en Railway con PostgreSQL.

**URL Backend:** `https://tu-url.railway.app`
**URL Frontend:** (configura Vercel después)

---

## 🆘 Si Necesitas Ayuda

**Dime:**
- ¿En qué paso estás?
- ¿Qué error ves?
- ¿Qué pantalla ves en Railway?

**Y te ayudo específicamente.**
