# 🚀 Instrucciones Simples - Ejecutar Pruebas

## Opción 1: Usando npm (Recomendado)

1. Abre Terminal
2. Copia y pega ESTAS DOS líneas (una por una, presionando Enter después de cada una):

```bash
cd /Users/javierruiz/Downloads/vacationhub-pro
```

```bash
npm run test:full
```

**IMPORTANTE:** Presiona **Enter** después de cada línea.

## Opción 2: Usando el script directo

1. Abre Terminal
2. Copia y pega:

```bash
cd /Users/javierruiz/Downloads/vacationhub-pro && node server/runTests.js
```

## Opción 3: Usando el script bash

1. Abre Terminal
2. Copia y pega:

```bash
bash /Users/javierruiz/Downloads/vacationhub-pro/PRUEBA_RAPIDA.sh
```

## ⚠️ Si No Pasa Nada

### Verifica que escribiste bien:
- `npm run test:full` (con espacios)
- NO `npm run test:full` sin espacios
- Presiona Enter DESPUÉS de escribir

### Verifica que estás en el lugar correcto:
```bash
pwd
```

Deberías ver: `/Users/javierruiz/Downloads/vacationhub-pro`

### Si sigue sin funcionar:
```bash
node server/runTests.js
```

Este comando hace lo mismo pero directamente.

## ✅ Qué Verás Cuando Funcione

Inmediatamente después de presionar Enter, verás:

```
🧪 Iniciando pruebas del sistema de emails...
============================================================
📧 PRUEBA 1: Nueva Solicitud → Notificar a Admins
...
```

Si NO ves esto en menos de 2 segundos, algo está mal.

