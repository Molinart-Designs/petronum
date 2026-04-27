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

/**
 * Añade `X-API-Key` si existe `PETMIND_BACKEND_API_KEY` (solo en el servidor, nunca `NEXT_PUBLIC_`).
 * FastAPI puede exigir esta cabecera además del Bearer JWT.
 */
export function withBackendApiKey(headers: Record<string, string>): Record<string, string> {
  const key = process.env.PETMIND_BACKEND_API_KEY?.trim();
  if (!key) return headers;
  return { ...headers, "X-API-Key": key };
}
