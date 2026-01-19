# 📋 Guía Paso a Paso: Cómo Ejecutar las Pruebas del Sistema

## 🎯 Objetivo

Ejecutar todas las pruebas del sistema de emails para verificar que todo funciona correctamente.

## 📝 Pasos Detallados

### Paso 1: Abrir la Terminal

1. Abre la aplicación **Terminal** en tu Mac
2. Navega a la carpeta del proyecto:
   ```bash
   cd /Users/javierruiz/Downloads/vacationhub-pro
   ```

### Paso 2: Verificar que Estás en el Directorio Correcto

Ejecuta este comando para verificar:
```bash
pwd
```

Deberías ver:
```
/Users/javierruiz/Downloads/vacationhub-pro
```

Si no estás ahí, ejecuta el comando del Paso 1.

### Paso 3: Ejecutar las Pruebas

Simplemente ejecuta este comando:
```bash
npm run test:full
```

### Paso 4: Ver los Resultados

Verás en la pantalla:

1. **Prueba 1: Nueva Solicitud**
   - Verás el email que se enviaría a los administradores
   - Incluye todos los detalles de la solicitud

2. **Prueba 2: Aprobar Solicitud**
   - Verás el email que se enviaría al empleado
   - Confirma la aprobación con todos los detalles

3. **Prueba 3: Rechazar Solicitud**
   - Verás el email que se enviaría al empleado
   - Incluye el motivo del rechazo

4. **Resumen Final**
   - Confirmación de que todas las pruebas pasaron

## 📸 Ejemplo de Salida

Cuando ejecutes `npm run test:full`, verás algo así:

```
🧪 Iniciando pruebas del sistema de emails...

============================================================

📧 PRUEBA 1: Nueva Solicitud → Notificar a Admins
------------------------------------------------------------
Empleado: Javier Ruiz Balado
Admins a notificar: Salvador Carrillo, Miguel Solana

📨 Email que se enviaría:
   To: salvador.carrillo@alter-5.com, miguel.solana@alter-5.com
   Subject: Nueva solicitud de vacaciones - Javier Ruiz Balado
   
   [Contenido del email...]

✅ 2/2 emails procesados

📧 PRUEBA 2: Aprobar Solicitud → Notificar al Empleado
------------------------------------------------------------
[... más contenido ...]

✅ RESUMEN DE PRUEBAS
✅ Todas las pruebas pasaron correctamente!
```

## 🔍 Qué Significa Cada Parte

### "📧 [DEV MODE] Email que se enviaría:"
- Esto significa que estás en **modo desarrollo**
- Los emails NO se envían realmente, solo se muestran en pantalla
- Perfecto para probar sin enviar emails reales

### "✅ X/X emails procesados"
- Indica cuántos emails se procesaron correctamente
- Si dice "2/2", significa que ambos emails se procesaron bien

### "✅ Email procesado: Éxito"
- Confirma que el email se generó correctamente
- En producción (con credenciales SMTP), esto significaría que se envió

## 🛠️ Solución de Problemas

### Error: "command not found: npm"
**Solución:** Necesitas instalar Node.js. Descárgalo de https://nodejs.org

### Error: "Cannot find module"
**Solución:** Ejecuta primero:
```bash
npm install
```

### No veo ningún output
**Solución:** Asegúrate de estar en el directorio correcto:
```bash
cd /Users/javierruiz/Downloads/vacationhub-pro
ls
```
Deberías ver archivos como `package.json`, `server/`, `src/`, etc.

## 🎓 Comandos Útiles Relacionados

### Ver solo la prueba de email básica:
```bash
npm run test:email
```

### Ver solo la prueba de recordatorios:
```bash
npm run test:reminders
```

### Ver todas las pruebas disponibles:
```bash
npm run
```
(Esto muestra todos los scripts disponibles)

## ✅ Verificación Rápida

Si todo funciona correctamente, al final verás:

```
============================================================
✅ RESUMEN DE PRUEBAS
============================================================
✅ Prueba 1: Notificación a admins - COMPLETADA
✅ Prueba 2: Notificación de aprobación - COMPLETADA
✅ Prueba 3: Notificación de rechazo - COMPLETADA

🎉 Todas las pruebas pasaron correctamente!
============================================================
```

## 🚀 Próximos Pasos

Una vez que veas que las pruebas funcionan:

1. **Para desarrollo:** Ya está listo, los emails se muestran en consola
2. **Para producción:** Configura credenciales SMTP en `.env` y los emails se enviarán realmente

## 💡 Consejo

Puedes ejecutar `npm run test:full` tantas veces como quieras. Cada vez verás los emails que se generarían en una situación real.

