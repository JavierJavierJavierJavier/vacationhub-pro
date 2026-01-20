# 🧭 Architecture Overview

## Frontend
- React + Vite + Tailwind.
- Auth via JWT stored in memory.
- Requests and employee data fetched from backend.

## Backend
- Express API con JWT.
- PostgreSQL para usuarios y solicitudes.
- Email via Resend API.

## Infra
- Frontend: Vercel.
- Backend: Render.
- DB: Railway PostgreSQL.

## Integrations
- Resend API para emails transaccionales.
