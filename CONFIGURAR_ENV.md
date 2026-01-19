# ⚙️ Configurar Archivo .env

## ✅ Archivo .env Creado

Ahora necesitas editarlo con tus datos reales.

---

## 📝 Pasos para Editar:

### Opción A: Desde Terminal (Más Rápido)

1. **Abre Terminal**

2. **Ejecuta este comando:**
   ```bash
   open -a TextEdit /Users/javierruiz/Downloads/vacationhub-pro/.env
   ```
   
   (Esto abrirá el archivo en TextEdit)

3. **Reemplaza estas dos líneas:**
   - `TU_EMAIL_AQUI@gmail.com` → Tu email de Gmail
   - `LA_CONTRASEÑA_DE_GMAIL_AQUI` → La contraseña de 16 caracteres que copiaste

4. **Guarda** (Cmd + S)

### Opción B: Desde Finder

1. **Abre Finder**
2. **Ve a:** `/Users/javierruiz/Downloads/vacationhub-pro/`
3. **Presiona:** `Cmd + Shift + .` (punto) para ver archivos ocultos
4. **Busca el archivo:** `.env`
5. **Abre con TextEdit** (doble click)
6. **Edita las dos líneas** (email y contraseña)
7. **Guarda**

---

## ✅ Ejemplo de cómo debería quedar:

```env
JWT_SECRET=Xt0SFuiCy/jPT5xA93BHDZVdOK/SYPL6b1EaR0S4Hdk=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=javier.ruiz@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
APP_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

(Reemplaza con tus datos reales)

---

## ✅ Cuando Termines

**Avísame diciendo:**
- "Ya edité el archivo .env"

**Y luego probamos que todo funciona.**

