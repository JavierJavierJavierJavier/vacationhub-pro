# 🔧 Solución de Problemas: npm run test:full

## ❌ Problema: "No pasa nada" al ejecutar el comando

### Posibles Causas y Soluciones

#### 1. ¿Presionaste Enter después de escribir el comando?

**Síntoma:** Escribes el comando pero no pasa nada

**Solución:** 
- Asegúrate de presionar **Enter** después de escribir `npm run test:full`
- El comando NO se ejecuta hasta que presionas Enter

#### 2. ¿Estás en el directorio correcto?

**Verificación:**
```bash
pwd
```

**Deberías ver:**
```
/Users/javierruiz/Downloads/vacationhub-pro
```

**Si no estás ahí:**
```bash
cd /Users/javierruiz/Downloads/vacationhub-pro
```

#### 3. ¿El comando está ejecutándose pero no ves el output?

**Prueba esto:**
```bash
npm run test:full 2>&1
```

Esto fuerza a mostrar todo el output.

#### 4. ¿Hay un error que no se muestra?

**Ejecuta con más detalle:**
```bash
npm run test:full --verbose
```

O directamente:
```bash
node server/runTests.js
```

#### 5. ¿Faltan dependencias?

**Ejecuta primero:**
```bash
npm install
```

Luego intenta de nuevo:
```bash
npm run test:full
```

## ✅ Verificación Paso a Paso

### Paso 1: Verifica que estás en el lugar correcto
```bash
pwd
ls package.json
```

### Paso 2: Verifica que Node.js funciona
```bash
node --version
```

Deberías ver algo como: `v20.x.x` o `v18.x.x`

### Paso 3: Ejecuta el comando
```bash
npm run test:full
```

### Paso 4: Espera unos segundos
El comando puede tardar 2-5 segundos en ejecutarse completamente.

## 🎯 Comando Alternativo (Más Directo)

Si `npm run test:full` no funciona, prueba directamente:

```bash
node server/runTests.js
```

Este comando hace exactamente lo mismo pero sin pasar por npm.

## 📸 Qué Deberías Ver

Cuando funciona correctamente, verás inmediatamente:

```
🧪 Iniciando pruebas del sistema de emails...

============================================================

📧 PRUEBA 1: Nueva Solicitud → Notificar a Admins
...
```

Si NO ves esto inmediatamente, hay un problema.

## 🆘 Si Nada Funciona

1. **Cierra y vuelve a abrir la Terminal**
2. **Ejecuta estos comandos uno por uno:**

```bash
cd /Users/javierruiz/Downloads/vacationhub-pro
pwd
ls
node --version
npm --version
node server/runTests.js
```

3. **Copia y pega aquí el resultado completo** de cada comando

## 💡 Consejo

Si escribes el comando y presionas Enter, deberías ver algo **inmediatamente** (en menos de 1 segundo). Si no ves nada después de 5 segundos, algo está mal.

