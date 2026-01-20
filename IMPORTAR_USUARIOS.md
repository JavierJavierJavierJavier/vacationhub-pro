# 👥 Importar Usuarios (CSV)

Este proceso carga usuarios reales en la base de datos (admins y empleados).

## ✅ Paso 1: Crear el CSV

Edita el archivo `data/users-template.csv` con tus usuarios reales.

Columnas requeridas:
- `name`
- `email`
- `deptId`

Columnas opcionales:
- `id` (si lo dejas vacío, se genera automático)
- `role` (`employee` o `admin`)
- `startDate` (YYYY-MM-DD)
- `password` (si lo dejas vacío, el usuario debe usar "Olvidé mi contraseña")

## ✅ Paso 2: Ejecutar importación

Usa las credenciales de Railway (las de `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`).

```bash
cd /Users/javierruiz/Downloads/vacationhub-pro

DB_HOST=nozomi.proxy.rlwy.net DB_PORT=43189 DB_NAME=railway DB_USER=postgres DB_PASSWORD=TU_PASSWORD DB_SSL=true npm run import:users
```

Si quieres probar sin escribir en la BD:

```bash
DB_HOST=... DB_PORT=... DB_NAME=... DB_USER=... DB_PASSWORD=... DB_SSL=true npm run import:users -- --dry-run
```

## ✅ Resultado esperado

El script mostrará cuántos usuarios se crearon, actualizaron u omitieron.
