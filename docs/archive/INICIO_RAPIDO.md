# 🚀 Inicio Rápido: Llevar VacationHub a Producción

## ⚡ Pasos Inmediatos (30 minutos)

### 1. Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto:

```bash
# JWT Secret (generar: openssl rand -base64 32)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@alter-5.com
SMTP_PASS=tu-app-password-de-gmail

# URLs
APP_URL=http://localhost:5173
PORT=4000
```

### 2. Configurar Gmail para Emails

1. Ve a: https://myaccount.google.com/apppasswords
2. Genera una "Contraseña de aplicación"
3. Copia la contraseña (16 caracteres)
4. Pégala en `SMTP_PASS` del `.env`

### 3. Probar que Funciona

```bash
# Probar emails
npm run test:email

# Si ves "✅ Email enviado correctamente!" → ¡Listo!
```

### 4. Build y Deploy

```bash
# Build frontend
npm run build

# Deploy en Vercel (más fácil)
# 1. Ve a vercel.com
# 2. Conecta tu repositorio
# 3. Build command: npm run build
# 4. Publish directory: dist
```

---

## 📋 Opciones de Deploy

### **Opción A: Rápido (Gratis)**
- **Frontend:** Vercel (gratis)
- **Backend:** Railway o Render (gratis tier)
- **BD:** SQLite (archivo) o PostgreSQL en Railway

### **Opción B: Profesional**
- **Frontend:** Vercel o Netlify
- **Backend:** Servidor propio (DigitalOcean, AWS)
- **BD:** PostgreSQL en servidor o servicio gestionado

---

## ⚠️ IMPORTANTE: Base de Datos

**Estado actual:** Todo está en memoria (se pierde al reiniciar)

**Para producción necesitas:**
1. PostgreSQL (recomendado)
2. O MongoDB
3. O SQLite (solo para empezar)

**Sin BD:** Solo funciona para pruebas, no para producción real.

---

## 🎯 ¿Qué Hacer Ahora?

### **Si quieres empezar HOY:**
1. ✅ Crear `.env` con credenciales
2. ✅ Probar emails
3. ✅ Deploy frontend (Vercel)
4. ✅ Deploy backend (Railway)
5. ⚠️ **Usar datos en memoria** (temporal)

### **Si quieres hacerlo BIEN:**
1. Todo lo anterior +
2. ✅ Configurar PostgreSQL
3. ✅ Migrar código a BD
4. ✅ Implementar hash de contraseñas
5. ✅ Configurar dominio

---

## 📚 Documentación Completa

- **`GUIA_PRODUCCION.md`** - Guía completa y detallada
- **`CHECKLIST_PRODUCCION.md`** - Checklist paso a paso

---

## 🆘 ¿Necesitas Ayuda?

**Puedo ayudarte con:**
- Configurar la base de datos
- Migrar el código
- Configurar el deploy
- Cualquier problema que encuentres

**Solo dime qué quieres hacer primero.**

