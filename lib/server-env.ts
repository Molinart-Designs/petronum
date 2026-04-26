/**
 * Variables solo para runtime en servidor (Route Handlers, Server Actions, `proxy.ts`).
 * No importar este módulo desde componentes cliente.
 */
function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/** URL base del FastAPI (sin barra final). */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return stripTrailingSlash(raw);
}
