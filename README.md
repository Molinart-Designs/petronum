# PetMind AI · Frontend (Next.js)

Web app para **PetMind AI**: asistente de cuidado de perros con respuestas fundamentadas, confianza, fuentes, disclaimers y aviso de seguimiento veterinario. Autenticación con **Auth0 Universal Login**; las llamadas al FastAPI pasan por un **BFF** en Next que adjunta `Authorization: Bearer` en el servidor (el access token no se expone al navegador).

## Backend (endpoints existentes)

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/v1/health` | Público |
| POST | `/api/v1/query` | Usuario autenticado |
| POST | `/api/v1/ingest` | Admin (UI + BFF comprueban rol; la API valida el token) |

No se añaden rutas nuevas al backend FastAPI. El prefijo `/api/petmind/*` en Next es un **proxy** hacia esas mismas rutas.

## Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena valores reales.

**Públicas (`NEXT_PUBLIC_*`)**: dominio Auth0, client ID, audience, URL base del API (referencia en UI).

**Solo servidor**: `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`, `PETMIND_BACKEND_API_KEY` (la misma clave que valida FastAPI en `X-API-Key`; el BFF la envía al upstream, nunca al navegador). No uses el prefijo `NEXT_PUBLIC_` en secretos.

**Auth0 Dashboard** (desarrollo): añade `http://localhost:3000/auth/callback` en *Allowed Callback URLs* y `http://localhost:3000` en *Allowed Logout URLs*.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Estructura relevante

```
proxy.ts                 # Next 16: Auth0 en el límite de red
lib/auth0.ts             # Auth0Client
lib/server-env.ts        # URL del FastAPI (solo servidor)
lib/env.ts               # Config segura para cliente + prefijo BFF
lib/auth/roles.ts        # Rol admin (claim configurable)
lib/api/                 # Cliente fetch → /api/petmind/...
app/api/petmind/[[...path]]/route.ts   # BFF + Bearer
app/page.tsx             # Landing
app/health/page.tsx      # Estado (público)
app/app/layout.tsx       # Protege /app/*
app/app/dashboard/
app/app/ask/
app/app/profile/
app/app/admin/ingest/
components/ask/          # Consulta + panel de respuesta
components/pet-profile/
components/ingest/
components/layout/site-header.tsx
providers/
```

## Flujo de auth (resumen)

1. El usuario visita `/auth/login` o signup (`screen_hint=signup`).
2. Auth0 Universal Login completa el flujo y devuelve a `/auth/callback`.
3. La sesión queda en cookies httpOnly cifradas (`AUTH0_SECRET`).
4. Las rutas bajo `/app/*` exigen sesión; si no hay, redirección a `/auth/login`.
5. El cliente llama a `/api/petmind/api/v1/...`; el Route Handler obtiene el access token con `getAccessToken(req, res)` y reenvía al FastAPI con `Authorization: Bearer`.

## Roles admin

Por defecto se buscan roles `admin` / `administrator` en el claim `NEXT_PUBLIC_AUTH0_ROLES_CLAIM` (default `https://petmind.ai/roles`) o en `https://auth0.com/roles`. Ajusta el claim a cómo expongas roles en el ID token (Actions / RBAC).
