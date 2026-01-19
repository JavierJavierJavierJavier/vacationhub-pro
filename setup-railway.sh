#!/bin/bash

# Script automatizado para configurar Railway
# Ejecutar con: bash setup-railway.sh

echo "🚀 Configuración Automática de Railway"
echo "======================================="
echo ""

# Verificar si Railway CLI está instalado; si no, usar npx
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI no encontrado. Usaré npx @railway/cli automáticamente."
    RAILWAY_CMD="npx @railway/cli"
else
    RAILWAY_CMD="railway"
fi

echo "✅ Railway CLI listo"
echo ""

# Login (browserless) - permite saltar si ya hiciste login
if [ -z "$SKIP_LOGIN" ]; then
  echo "🔐 Paso 1: Login en Railway (browserless)"
  echo "   Te mostrará una URL y un código para autorizar..."
  $RAILWAY_CMD login --browserless
else
  echo "🔐 Paso 1: Login en Railway (saltado por SKIP_LOGIN=1)"
fi

# Crear proyecto
echo ""
echo "📁 Paso 2: Creando proyecto..."
$RAILWAY_CMD init

# Provisionar PostgreSQL
echo ""
echo "🗄️  Paso 3: PostgreSQL"
echo "   ⚠️  Railway CLI cambió: crea PostgreSQL desde el panel web."
echo "   En Railway: New → Database → PostgreSQL"

# Enlazar servicio (backend) antes de usar variables
echo ""
echo "🔗 Paso 4: Vinculando servicio (backend)..."
echo "   Si no aparece ningún servicio, crea uno en Railway: New → Service → GitHub Repo"
$RAILWAY_CMD service

# Obtener variables de PostgreSQL
echo ""
echo "📋 Paso 5: Obteniendo credenciales de PostgreSQL..."
$RAILWAY_CMD variables

# Configurar variables
echo ""
echo "⚙️  Paso 6: Configurando variables de entorno..."

# Generar JWT_SECRET
JWT_SECRET=$(openssl rand -hex 32)

# Obtener credenciales de PostgreSQL (sin jq)
VARS_JSON=$($RAILWAY_CMD variables --json)
PGHOST=$(VARS_JSON="$VARS_JSON" node -e "const v=JSON.parse(process.env.VARS_JSON||'[]'); console.log(v.find(x=>x.name==='PGHOST')?.value||'')")
PGPORT=$(VARS_JSON="$VARS_JSON" node -e "const v=JSON.parse(process.env.VARS_JSON||'[]'); console.log(v.find(x=>x.name==='PGPORT')?.value||'')")
PGDATABASE=$(VARS_JSON="$VARS_JSON" node -e "const v=JSON.parse(process.env.VARS_JSON||'[]'); console.log(v.find(x=>x.name==='PGDATABASE')?.value||'')")
PGUSER=$(VARS_JSON="$VARS_JSON" node -e "const v=JSON.parse(process.env.VARS_JSON||'[]'); console.log(v.find(x=>x.name==='PGUSER')?.value||'')")
PGPASSWORD=$(VARS_JSON="$VARS_JSON" node -e "const v=JSON.parse(process.env.VARS_JSON||'[]'); console.log(v.find(x=>x.name==='PGPASSWORD')?.value||'')")

# Configurar variables
$RAILWAY_CMD variables set DB_HOST=$PGHOST
$RAILWAY_CMD variables set DB_PORT=$PGPORT
$RAILWAY_CMD variables set DB_NAME=$PGDATABASE
$RAILWAY_CMD variables set DB_USER=$PGUSER
$RAILWAY_CMD variables set DB_PASSWORD=$PGPASSWORD
$RAILWAY_CMD variables set DB_SSL=true
$RAILWAY_CMD variables set JWT_SECRET=$JWT_SECRET
$RAILWAY_CMD variables set SMTP_HOST=sandbox.smtp.mailtrap.io
$RAILWAY_CMD variables set SMTP_PORT=2525
$RAILWAY_CMD variables set PORT=4000
$RAILWAY_CMD variables set NODE_ENV=production

# Si existe .env, intentar leer SMTP_USER/SMTP_PASS de forma segura
if [ -f .env ]; then
  echo ""
  echo "📧 Detecté archivo .env. Intentando configurar SMTP_USER y SMTP_PASS..."
  SMTP_USER_VALUE=$(node -e "const fs=require('fs'); const env=fs.readFileSync('.env','utf8'); const m=env.match(/^SMTP_USER=(.*)$/m); if(!m){process.exit(0)}; let v=m[1].trim(); v=v.replace(/^\"|\"$/g,''); console.log(v);")
  SMTP_PASS_VALUE=$(node -e "const fs=require('fs'); const env=fs.readFileSync('.env','utf8'); const m=env.match(/^SMTP_PASS=(.*)$/m); if(!m){process.exit(0)}; let v=m[1].trim(); v=v.replace(/^\"|\"$/g,''); console.log(v);")
  if [ -n "$SMTP_USER_VALUE" ] && [ -n "$SMTP_PASS_VALUE" ]; then
    $RAILWAY_CMD variables set SMTP_USER="$SMTP_USER_VALUE"
    $RAILWAY_CMD variables set SMTP_PASS="$SMTP_PASS_VALUE"
    echo "✅ SMTP_USER y SMTP_PASS configurados desde .env"
  else
    echo "⚠️  No encontré SMTP_USER/SMTP_PASS válidos en .env"
  fi
fi

echo ""
echo "📧 Si no se configuraron SMTP_USER y SMTP_PASS automáticamente:"
echo "   $RAILWAY_CMD variables set SMTP_USER=<tu-username-mailtrap>"
echo "   $RAILWAY_CMD variables set SMTP_PASS=<tu-password-mailtrap>"

# Ejecutar migración
echo ""
echo "🗄️  Paso 7: Ejecutando migración de base de datos..."
$RAILWAY_CMD run node server/migrate.js

# Deploy
echo ""
echo "🚀 Paso 8: Haciendo deploy..."
$RAILWAY_CMD up

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Obtén la URL: $RAILWAY_CMD domain"
echo "   2. Actualiza APP_URL: $RAILWAY_CMD variables set APP_URL=<tu-url>"
echo "   3. Verifica el deploy: $RAILWAY_CMD logs"
