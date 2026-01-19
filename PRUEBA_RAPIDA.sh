#!/bin/bash

# Script de prueba rápida - ejecuta: bash PRUEBA_RAPIDA.sh

echo "🔍 Verificando sistema..."
echo ""

cd /Users/javierruiz/Downloads/vacationhub-pro

echo "📁 Directorio: $(pwd)"
echo ""

if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    exit 1
fi

if [ ! -f "server/runTests.js" ]; then
    echo "❌ Error: No se encuentra server/runTests.js"
    exit 1
fi

echo "✅ Archivos encontrados"
echo ""
echo "🚀 Ejecutando pruebas..."
echo ""

node server/runTests.js

echo ""
echo "✅ Pruebas completadas"

