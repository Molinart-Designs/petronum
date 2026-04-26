import { apiFetch } from "@/lib/api/client";
import type { IngestRequest, IngestResponse } from "@/lib/api/types";

export function postIngest(body: IngestRequest, signal?: AbortSignal): Promise<IngestResponse> {
  return apiFetch<IngestResponse>("/api/v1/ingest", {
    method: "POST",
    body,
    signal,
  });
}
