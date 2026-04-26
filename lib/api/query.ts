import { apiFetch } from "@/lib/api/client";
import type { QueryRequest, QueryResponse } from "@/lib/api/types";

export function postQuery(body: QueryRequest, signal?: AbortSignal): Promise<QueryResponse> {
  return apiFetch<QueryResponse>("/api/v1/query", {
    method: "POST",
    body,
    signal,
  });
}
