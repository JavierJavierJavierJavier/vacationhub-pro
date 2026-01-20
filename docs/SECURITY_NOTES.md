# 🔐 Security Notes

## Autenticación
- JWT con expiración corta (8h).
- `JWT_SECRET` requerido en producción.
- Rate limiting en login y recuperación de contraseña.

## Contraseñas
- Hash con bcrypt.
- Reset de contraseña con token temporal.

## Email
- Envío por Resend API (HTTP), evita bloqueos de SMTP.

## Base de datos
- PostgreSQL en Railway.
- Variables sensibles en Render/Vercel (no en repo).

## Recomendaciones pendientes
- Rate limiting global por IP.
- Auditoría de acciones sensibles (login, cambios de rol).
