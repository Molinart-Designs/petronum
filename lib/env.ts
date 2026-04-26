/**
 * Valores seguros para el **navegador** (y defaults para SSR cuando aplica).
 * Secretos (`AUTH0_SECRET`, `AUTH0_CLIENT_SECRET`) no aparecen aquí.
 */
function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

const rawAppBase = process.env.APP_BASE_URL ?? "http://localhost:3000";

export const env = {
  appBaseUrl: stripTrailingSlash(rawAppBase),
  /** Solo informativo en UI (público). El BFF usa el mismo valor en el servidor. */
  apiBaseUrlDisplay:
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "",
  /** Prefijo del BFF de Next hacia FastAPI (misma origen, cookies de sesión). */
  petmindBffPrefix: "/api/petmind",
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? "",
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? "",
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE ?? "",
  },
  /** Claim donde vienen roles de Auth0 (Action / RBAC). Ajusta a tu tenant. */
  rolesClaim: process.env.NEXT_PUBLIC_AUTH0_ROLES_CLAIM ?? "https://petmind.ai/roles",
} as const;

export type Env = typeof env;
