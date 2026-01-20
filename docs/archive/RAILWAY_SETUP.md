# 🚀 Configuración de Railway - Paso a Paso

## ✅ Lo que YO hago automáticamente:
- ✅ Scripts de configuración listos
- ✅ Variables de entorno preparadas
- ✅ Código listo para Railway

## 📋 Lo que TÚ haces (10 minutos):

### PASO 1: Crear Cuenta en Railway (2 minutos)

1. **Ve a:** https://railway.app
2. **Click en:** "Start a New Project" o "Login"
3. **Elige:** "Sign Up with GitHub" (recomendado)
4. **Autoriza Railway** con GitHub

---

### PASO 2: Crear Base de Datos PostgreSQL (3 minutos)

1. **Dentro de Railway**, click en **"New Project"**
2. **Click en:** "Provision PostgreSQL" (o busca "PostgreSQL" en el marketplace)
3. **Espera** a que se cree (tarda ~30 segundos)
4. **Click en la base de datos** que se creó

---

### PASO 3: Copiar Credenciales (2 minutos)

1. **Dentro de tu base de datos PostgreSQL**, ve a la pestaña **"Variables"**
2. **Verás estas variables:**
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

3. **Copia cada una** (click en el icono de copiar)

---

### PASO 4: Configurar Variables (3 minutos)

**Opción A: Desde Railway Dashboard**

1. **Vuelve a tu proyecto** (no la BD, el proyecto principal)
2. **Click en:** "New Service" → "GitHub Repo"
3. **Conecta tu repositorio** de GitHub
4. **Selecciona el repositorio** `vacationhub-pro`
5. **Railway detectará** que es Node.js automáticamente

6. **Ve a:** "Variables" (en el servicio)
7. **Agrega estas variables:**

```
DB_HOST=<pega PGHOST aquí>
DB_PORT=<pega PGPORT aquí>
DB_NAME=<pega PGDATABASE aquí>
DB_USER=<pega PGUSER aquí>
DB_PASSWORD=<pega PGPASSWORD aquí>
DB_SSL=true
JWT_SECRET=<genera uno aleatorio>
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<tu username de Mailtrap>
SMTP_PASS=<tu password de Mailtrap>
APP_URL=<tu URL de Railway, ej: https://vacationhub-production.up.railway.app>
PORT=4000
NODE_ENV=production
```

**Opción B: Desde Railway CLI** (más rápido)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Agregar variables (una por una)
railway variables set DB_HOST=<PGHOST>
railway variables set DB_PORT=<PGPORT>
railway variables set DB_NAME=<PGDATABASE>
railway variables set DB_USER=<PGUSER>
railway variables set DB_PASSWORD=<PGPASSWORD>
railway variables set DB_SSL=true
railway variables set JWT_SECRET=<genera uno aleatorio>
railway variables set SMTP_HOST=sandbox.smtp.mailtrap.io
railway variables set SMTP_PORT=2525
railway variables set SMTP_USER=<tu username de Mailtrap>
railway variables set SMTP_PASS=<tu password de Mailtrap>
railway variables set APP_URL=<tu URL de Railway>
railway variables set PORT=4000
railway variables set NODE_ENV=production
```

---

### PASO 5: Ejecutar Migración (1 minuto)

**Opción A: Desde Railway Dashboard**

1. **Ve a tu servicio** en Railway
2. **Click en:** "Deployments" → "Latest"
3. **Click en:** "View Logs"
4. **Busca:** El log debería mostrar que la migración se ejecutó automáticamente

**Opción B: Desde Railway CLI**

```bash
railway run node server/migrate.js
```

**Opción C: Desde tu máquina local** (temporalmente)

```bash
# Configura variables temporalmente
export DB_HOST=<PGHOST>
export DB_PORT=<PGPORT>
export DB_NAME=<PGDATABASE>
export DB_USER=<PGUSER>
export DB_PASSWORD=<PGPASSWORD>
export DB_SSL=true

# Ejecuta migración
node server/migrate.js
```

---

### PASO 6: Verificar (1 minuto)

1. **Ve a tu servicio** en Railway
2. **Click en:** "Settings" → "Generate Domain"
3. **Copia la URL** (ej: `https://vacationhub-production.up.railway.app`)
4. **Abre:** `https://tu-url.railway.app/api/login` en tu navegador
5. **Deberías ver:** Un error JSON (eso es bueno, significa que el servidor está corriendo)

---

## ✅ ¡Listo!

Tu aplicación está corriendo en Railway con PostgreSQL.

---

## 🆘 Si Algo No Funciona

### Error: "Cannot connect to database"

**Solución:**
- Verifica que las variables `DB_*` estén correctas
- Verifica que la BD esté en el mismo proyecto de Railway
- Espera unos minutos (Railway puede tardar en propagar variables)

### Error: "relation does not exist"

**Solución:**
- Ejecuta la migración: `railway run node server/migrate.js`
- O desde local con las credenciales de Railway

### Error: "Port already in use"

**Solución:**
- Railway usa la variable `PORT` automáticamente
- No necesitas configurarla manualmente
- Si aparece, elimínala de las variables

---

## 💡 Tips

1. **Railway hace backups automáticos** de PostgreSQL
2. **Puedes ver logs** en tiempo real desde el dashboard
3. **Puedes hacer rollback** de deployments si algo falla
4. **Railway tiene plan gratuito** generoso para empezar

---

## 📞 ¿Necesitas Ayuda?

Si te quedas atascado en algún paso:
1. **Dime en qué paso estás**
2. **Qué error ves** (si hay)
3. **Y te ayudo específicamente**
