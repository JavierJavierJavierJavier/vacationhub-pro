# 🚀 Guía Completa: Llevar VacationHub Pro a Producción

**Objetivo:** Preparar la aplicación para uso real por toda la empresa

---

## 📋 Checklist Pre-Producción

### ✅ **1. Configuración de Variables de Entorno**

#### Crear archivo `.env` en la raíz del proyecto:

```bash
# JWT Secret (generar uno seguro)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_minimo_32_caracteres

# SMTP Configuration (para emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@alter-5.com
SMTP_PASS=tu_contraseña_de_aplicacion

# Server Configuration
PORT=4000
NODE_ENV=production

# Frontend URL (para links en emails)
FRONTEND_URL=https://vacaciones.alter-5.com
```

#### ⚠️ **IMPORTANTE:**
- **NO** subir `.env` a Git (ya debería estar en `.gitignore`)
- Generar `JWT_SECRET` seguro: `openssl rand -base64 32`
- Para Gmail, usar "Contraseña de aplicación" (no la contraseña normal)

---

### ✅ **2. Base de Datos (CRÍTICO)**

**Estado actual:** Todo está en memoria (se pierde al reiniciar)

**Opciones:**

#### **Opción A: PostgreSQL (Recomendado para producción)**
```bash
# Instalar dependencias
npm install pg

# Crear tabla de empleados
CREATE TABLE employees (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  dept_id VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'employee',
  start_date DATE
);

# Crear tabla de solicitudes
CREATE TABLE vacation_requests (
  id VARCHAR PRIMARY KEY,
  employee_id VARCHAR REFERENCES employees(id),
  year INTEGER NOT NULL,
  status VARCHAR NOT NULL,
  days INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  request_date DATE NOT NULL,
  reason TEXT,
  type VARCHAR NOT NULL,
  backup VARCHAR,
  reviewer VARCHAR,
  review_date DATE,
  rejection_reason TEXT
);
```

#### **Opción B: MongoDB (Más fácil de empezar)**
```bash
npm install mongoose
```

#### **Opción C: SQLite (Para empezar rápido, luego migrar)**
```bash
npm install better-sqlite3
```

**Recomendación:** PostgreSQL para producción, SQLite para desarrollo rápido.

---

### ✅ **3. Autenticación Real**

**Estado actual:** Credenciales hardcodeadas en `server/authData.js`

**Necesitas:**
1. **Hash de contraseñas** (bcrypt)
2. **Base de datos de usuarios**
3. **Sistema de registro/recuperación de contraseña**

```bash
npm install bcrypt
```

**Implementar:**
- Hash de contraseñas al crear usuarios
- Comparación en login
- Endpoint de cambio de contraseña
- Endpoint de recuperación (opcional)

---

### ✅ **4. Persistencia de Datos**

**Archivos a migrar a BD:**
- `src/data/employees.js` → Tabla `employees`
- `src/data/initialRequests.js` → Tabla `vacation_requests`
- `server/requestStorage.js` → Tabla `request_tracking`

**Mantener en código:**
- `src/data/holidays.js` (puede quedarse, o BD)
- `src/data/absenceTypes.js` (puede quedarse)

---

### ✅ **5. Configuración de Email en Producción**

#### **Para Gmail:**
1. Ir a: https://myaccount.google.com/apppasswords
2. Generar "Contraseña de aplicación"
3. Usar esa contraseña en `SMTP_PASS`

#### **Para otros proveedores:**
- **SendGrid:** Más profesional, mejor para producción
- **Mailgun:** Alternativa popular
- **AWS SES:** Si usas AWS

**Recomendación:** SendGrid o Mailgun para producción.

---

### ✅ **6. Build y Deployment**

#### **Build del Frontend:**
```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos.

#### **Opciones de Deployment:**

**A) Vercel (Más fácil - Recomendado para empezar)**
```bash
npm install -g vercel
vercel
```

**B) Netlify**
- Conectar repositorio Git
- Build command: `npm run build`
- Publish directory: `dist`

**C) Servidor propio**
- Nginx como reverse proxy
- Servir `dist/` como archivos estáticos
- Backend en Node.js en puerto 4000

---

### ✅ **7. Backend en Producción**

#### **Usar PM2 para mantener el proceso activo:**
```bash
npm install -g pm2
pm2 start server/index.js --name vacationhub-api
pm2 save
pm2 startup  # Para iniciar al arrancar el servidor
```

#### **O usar Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "server/index.js"]
```

---

### ✅ **8. Seguridad**

#### **Checklist de Seguridad:**
- [ ] HTTPS habilitado (Let's Encrypt gratuito)
- [ ] Variables de entorno no expuestas
- [ ] CORS configurado correctamente
- [ ] Rate limiting en APIs
- [ ] Validación de inputs
- [ ] Sanitización de datos
- [ ] Headers de seguridad (helmet.js)

```bash
npm install helmet express-rate-limit
```

---

### ✅ **9. Monitoreo y Logs**

#### **Implementar logging:**
```bash
npm install winston
```

#### **Monitoreo:**
- **Sentry** para errores
- **LogRocket** para sesiones
- **Google Analytics** para uso

---

### ✅ **10. Documentación para Usuarios**

**Crear:**
1. **Guía de usuario** (cómo solicitar vacaciones, etc.)
2. **FAQ** (preguntas comunes)
3. **Video tutorial** (opcional pero muy útil)

---

## 🎯 Plan de Implementación (Priorizado)

### **Fase 1: Mínimo Viable (1-2 días)**
1. ✅ Configurar variables de entorno
2. ✅ Configurar SMTP (Gmail o SendGrid)
3. ✅ Build y deploy frontend (Vercel)
4. ✅ Deploy backend (Railway, Render, o servidor propio)
5. ✅ Probar flujo completo

### **Fase 2: Persistencia (2-3 días)**
1. ✅ Elegir base de datos (PostgreSQL recomendado)
2. ✅ Migrar empleados a BD
3. ✅ Migrar solicitudes a BD
4. ✅ Actualizar código para usar BD
5. ✅ Probar que todo funciona

### **Fase 3: Autenticación Real (1-2 días)**
1. ✅ Implementar hash de contraseñas
2. ✅ Migrar autenticación a BD
3. ✅ Endpoint de cambio de contraseña
4. ✅ Probar login/logout

### **Fase 4: Producción (1 día)**
1. ✅ Configurar dominio
2. ✅ HTTPS (Let's Encrypt)
3. ✅ Monitoreo básico
4. ✅ Documentación usuarios
5. ✅ Lanzamiento

---

## 📝 Pasos Inmediatos (Hoy)

### **1. Crear archivo `.env`**
```bash
cd /Users/javierruiz/Downloads/vacationhub-pro
touch .env
```

Añadir las variables (ver arriba).

### **2. Verificar `.gitignore`**
Asegurarse de que `.env` está en `.gitignore`.

### **3. Probar build**
```bash
npm run build
```

### **4. Probar servidor con variables de entorno**
```bash
# En una terminal
npm run dev:server

# En otra terminal
npm run dev
```

---

## 🔧 Scripts Útiles para Añadir

Añadir a `package.json`:

```json
{
  "scripts": {
    "start": "node server/index.js",
    "start:prod": "NODE_ENV=production node server/index.js",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js"
  }
}
```

---

## 📊 Checklist Final Pre-Lanzamiento

- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada y migrada
- [ ] Emails funcionando (probar con email real)
- [ ] Build de producción funciona
- [ ] Frontend deployado
- [ ] Backend deployado y accesible
- [ ] HTTPS configurado
- [ ] Dominio configurado
- [ ] Todos los usuarios pueden hacer login
- [ ] Flujo completo probado (crear solicitud → aprobar → email)
- [ ] Documentación para usuarios creada
- [ ] Backup de base de datos configurado

---

## 🆘 Soporte y Mantenimiento

**Consideraciones:**
- Backup diario de BD
- Monitoreo de errores
- Actualizaciones de seguridad
- Capacitación a usuarios
- Canal de soporte (email, Slack, etc.)

---

## 💡 Recomendaciones Finales

1. **Empezar pequeño:** Deploy en Vercel + Railway (gratis para empezar)
2. **Base de datos:** PostgreSQL en Railway o Supabase (gratis tier)
3. **Emails:** SendGrid (100 emails/día gratis)
4. **Dominio:** Comprar dominio y configurar DNS
5. **Monitoreo:** Sentry (gratis tier)

---

¿Quieres que te ayude a implementar alguna de estas fases específicamente?

