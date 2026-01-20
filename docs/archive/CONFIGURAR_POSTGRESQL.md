# 🗄️ Configuración de PostgreSQL

## 📋 Guía Paso a Paso

### Opción 1: PostgreSQL Local (Desarrollo)

#### 1. Instalar PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Descargar desde: https://www.postgresql.org/download/windows/
- Instalar y seguir el asistente

#### 2. Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql postgres

# Crear base de datos
CREATE DATABASE vacationhub;

# Crear usuario (opcional)
CREATE USER vacationhub_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE vacationhub TO vacationhub_user;

# Salir
\q
```

#### 3. Configurar Variables de Entorno

Agrega al archivo `.env`:

```env
# PostgreSQL Local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vacationhub
DB_USER=postgres
DB_PASSWORD=tu_password_postgres
DB_SSL=false
```

#### 4. Ejecutar Migración

```bash
node server/migrate.js
```

---

### Opción 2: PostgreSQL en Railway (Producción) ⭐ RECOMENDADO

#### 1. Crear Cuenta en Railway

1. Ve a: https://railway.app
2. Click en "Start a New Project"
3. Selecciona "Provision PostgreSQL"

#### 2. Obtener Credenciales

1. En Railway, click en tu base de datos PostgreSQL
2. Ve a la pestaña "Variables"
3. Copia estas variables:
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

#### 3. Configurar Variables de Entorno

En Railway, agrega estas variables a tu servicio backend:

```env
DB_HOST=<PGHOST>
DB_PORT=<PGPORT>
DB_NAME=<PGDATABASE>
DB_USER=<PGUSER>
DB_PASSWORD=<PGPASSWORD>
DB_SSL=true
```

#### 4. Ejecutar Migración

**Opción A: Desde Railway CLI**
```bash
railway run node server/migrate.js
```

**Opción B: Desde tu máquina local**
```bash
# Configura temporalmente las variables de entorno
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

### Opción 3: PostgreSQL en Render (Alternativa)

1. Ve a: https://render.com
2. Click en "New" → "PostgreSQL"
3. Configura nombre y región
4. Copia las credenciales de conexión
5. Configura variables de entorno igual que Railway

---

## ✅ Verificar Configuración

### 1. Probar Conexión

```bash
node -e "
import('./server/database.js').then(async ({ testConnection }) => {
  const connected = await testConnection();
  console.log(connected ? '✅ Conectado' : '❌ Error');
  process.exit(connected ? 0 : 1);
});
"
```

### 2. Verificar Tablas

```bash
psql -h <DB_HOST> -U <DB_USER> -d <DB_NAME> -c "\dt"
```

Deberías ver:
- departments
- users
- vacation_requests
- password_reset_tokens
- audit_logs

---

## 🔧 Troubleshooting

### Error: "Connection refused"

**Solución:**
- Verifica que PostgreSQL esté corriendo: `brew services list` (macOS)
- Verifica el puerto: `lsof -i :5432`
- Verifica firewall

### Error: "password authentication failed"

**Solución:**
- Verifica la contraseña en `.env`
- Verifica que el usuario exista en PostgreSQL

### Error: "database does not exist"

**Solución:**
- Crea la base de datos: `CREATE DATABASE vacationhub;`
- Verifica el nombre en `.env`

### Error: "relation does not exist"

**Solución:**
- Ejecuta la migración: `node server/migrate.js`
- Verifica que el esquema se creó correctamente

---

## 📝 Variables de Entorno Completas

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vacationhub
DB_USER=postgres
DB_PASSWORD=tu_password
DB_SSL=false

# JWT
JWT_SECRET=tu-secret-super-seguro-aqui

# SMTP (Mailtrap para desarrollo)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu-username-mailtrap
SMTP_PASS=tu-password-mailtrap

# App
APP_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

---

## 🎯 Próximos Pasos

1. ✅ Configurar PostgreSQL
2. ✅ Ejecutar migración
3. ✅ Verificar conexión
4. ✅ Probar login
5. ✅ Probar cambio de contraseña

---

## 💡 Notas

- **Desarrollo:** Usa PostgreSQL local o Railway
- **Producción:** Usa Railway o Render (PostgreSQL gestionado)
- **Backups:** Railway y Render hacen backups automáticos
- **SSL:** Siempre usa `DB_SSL=true` en producción

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica las variables de entorno
2. Verifica que PostgreSQL esté corriendo
3. Verifica los logs: `npm run dev:server`
4. Revisa `CONFIGURAR_POSTGRESQL.md` para más detalles
