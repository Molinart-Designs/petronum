import { apiFetch } from "@/lib/api/client";
import type { HealthResponse } from "@/lib/api/types";

export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/api/v1/health", { method: "GET", signal });
}
