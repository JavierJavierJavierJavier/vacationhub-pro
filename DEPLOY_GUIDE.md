# 🚀 Guía de Deploy Paso a Paso

**Cuando tengas todo listo del archivo `INSTRUCCIONES_PARA_TI.md`, sigue esto:**

---

## 📦 Parte 1: Deploy del Backend (Railway)

### Paso 1: Conectar Repositorio
1. Entra a Railway: https://railway.app
2. Click en "New Project"
3. Elige "Deploy from GitHub repo"
4. Selecciona tu repositorio `vacationhub-pro`
5. Railway detectará automáticamente que es Node.js

### Paso 2: Configurar Variables de Entorno
1. En Railway, ve a tu proyecto
2. Click en "Variables"
3. Añade estas variables (copia de tu `.env` local):
   ```
   JWT_SECRET=tu_jwt_secret_aqui
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=tu-app-password
   APP_URL=https://tu-frontend.vercel.app
   PORT=4000
   NODE_ENV=production
   ```

### Paso 3: Obtener URL del Backend
1. Railway te dará una URL automática (ej: `vacationhub-production.up.railway.app`)
2. **Copia esa URL** - la necesitarás para el frontend
3. Debería ser algo como: `https://vacationhub-production.up.railway.app`

### Paso 4: Verificar que Funciona
1. Ve a: `https://tu-url-railway.app/api/login` (debería dar error 400, no 404)
2. Si da 404, el deploy no funcionó
3. Si da 400, ¡funciona! (esperado, falta el body)

**✅ Backend listo cuando:** La URL responde (aunque sea con error 400).

---

## 🎨 Parte 2: Deploy del Frontend (Vercel)

### Paso 1: Conectar Repositorio
1. Entra a Vercel: https://vercel.com
2. Click en "Add New Project"
3. Selecciona tu repositorio `vacationhub-pro`
4. Vercel detectará automáticamente Vite

### Paso 2: Configurar Build
Vercel debería detectar automáticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Si no, configúralo manualmente.

### Paso 3: Configurar Variables de Entorno
1. En Vercel, ve a "Settings" → "Environment Variables"
2. Añade:
   ```
   VITE_API_URL=https://tu-url-railway.app
   ```
   (Usa la URL que copiaste de Railway)

### Paso 4: Deploy
1. Click en "Deploy"
2. Espera 2-3 minutos
3. Vercel te dará una URL (ej: `vacationhub-pro.vercel.app`)

### Paso 5: Actualizar APP_URL en Railway
1. Vuelve a Railway
2. Actualiza la variable `APP_URL` con la URL de Vercel:
   ```
   APP_URL=https://vacationhub-pro.vercel.app
   ```
3. Railway se reiniciará automáticamente

**✅ Frontend listo cuando:** Puedes acceder a la URL de Vercel y ver la app.

---

## 🧪 Parte 3: Probar que Todo Funciona

### Test 1: Login
1. Ve a tu URL de Vercel
2. Intenta hacer login con:
   - Email: `javier.ruiz@alter-5.com`
   - Password: `OcPHn41$PTRr`
3. Deberías poder entrar

### Test 2: Crear Solicitud
1. Crea una solicitud de vacaciones
2. Verifica que no da error
3. Revisa los logs de Railway - deberías ver el email en consola o recibirlo

### Test 3: Emails
1. Si configuraste SMTP correctamente, deberías recibir emails
2. Si no, revisa los logs de Railway para ver errores

---

## 🐛 Troubleshooting

### Backend no responde
- Verifica que Railway está "Running"
- Revisa los logs en Railway
- Verifica que las variables de entorno están bien

### Frontend no se conecta al backend
- Verifica `VITE_API_URL` en Vercel
- Verifica que la URL de Railway es correcta
- Rehaz el deploy del frontend después de cambiar variables

### Emails no funcionan
- Verifica `SMTP_PASS` en Railway (sin espacios)
- Verifica que la contraseña de aplicación es correcta
- Revisa logs de Railway para ver el error exacto

---

## ✅ Checklist Final

- [ ] Backend deployado en Railway y responde
- [ ] Frontend deployado en Vercel y carga
- [ ] Puedo hacer login
- [ ] Puedo crear solicitudes
- [ ] Los emails se envían (o al menos aparecen en logs)

**¡Listo para usar! 🎉**

---

## 📝 URLs Finales

Guarda estas URLs:
- **Frontend:** `https://tu-app.vercel.app`
- **Backend:** `https://tu-backend.railway.app`

**Comparte solo la URL del frontend con los usuarios.**

