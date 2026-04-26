import { env } from "@/lib/env";

/**
 * Error de API tipado para que la UI pueda diferenciar entre fallos
 * de red, errores HTTP y respuestas con cuerpo de error del backend.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
}

/** Soporta mensajes tipo FastAPI (`detail`) y genéricos (`message`). */
function extractApiErrorMessage(payload: unknown, path: string, status: number): string {
  if (!payload || typeof payload !== "object") {
    return `Error ${status} al llamar ${path}`;
  }
  const o = payload as Record<string, unknown>;
  if (typeof o.message === "string" && o.message.length > 0) return o.message;
  if (typeof o.error === "string" && o.error.length > 0) return o.error;
  const detail = o.detail;
  if (typeof detail === "string" && detail.length > 0) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "msg" in first) {
      const msg = (first as { msg?: unknown }).msg;
      if (typeof msg === "string") return msg;
    }
  }
  return `Error ${status} al llamar ${path}`;
}

function getOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return env.appBaseUrl;
}

function applySearchParams(
  url: URL,
  searchParams?: RequestOptions["searchParams"],
): void {
  if (!searchParams) return;
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
}

/**
 * Construye URL hacia el BFF de Next (`/api/petmind/...`), misma origen.
 * El token **no** viaja en JS: el Route Handler añade `Authorization: Bearer`.
 */
function buildUrl(path: string, searchParams?: RequestOptions["searchParams"]): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${env.petmindBffPrefix}${normalizedPath}`, getOrigin());
  applySearchParams(url, searchParams);
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, searchParams, ...rest } = options;
  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = extractApiErrorMessage(payload, path, response.status);
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
