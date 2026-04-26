"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { getHealth } from "@/lib/api/health";
import type { HealthResponse } from "@/lib/api/types";
import { env } from "@/lib/env";
import { queryKeys } from "@/lib/query-keys";

function formatUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h} h ${m} min`;
  if (m > 0) return `${m} min ${s} s`;
  return `${s} s`;
}

function isHealthyStatus(status: string): boolean {
  const normalized = status.toLowerCase();
  return ["ok", "healthy", "up", "alive"].includes(normalized);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Error desconocido al contactar el backend.";
}

function isLikelyNetworkOrCors(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes("failed to fetch") || m.includes("networkerror") || m.includes("load failed");
}

export function HealthStatus() {
  const { data, error, isPending, isError, isFetching, refetch, dataUpdatedAt, isFetched } =
    useQuery({
      queryKey: queryKeys.health(),
      queryFn: ({ signal }) => getHealth(signal),
    });

  const showSkeleton = isPending && data === undefined;
  const showStaleError = isError && data !== undefined;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                Backend PetMind AI
              </CardTitle>
              <CardDescription className="space-y-2 text-xs text-muted-foreground">
                <p>
                  El navegador llama al BFF{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                    {env.petmindBffPrefix}
                  </code>
                  ; Next reenvía a FastAPI y añade el token solo en el servidor.
                </p>
                {env.apiBaseUrlDisplay ? (
                  <p>
                    URL pública de referencia del API:{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                      {env.apiBaseUrlDisplay}
                    </code>
                  </p>
                ) : null}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="shrink-0 gap-1.5"
            >
              <RefreshCw className={isFetching ? "size-3.5 animate-spin" : "size-3.5"} aria-hidden />
              {isFetching ? "Comprobando…" : "Comprobar de nuevo"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSkeleton ? (
            <div className="space-y-3" aria-busy="true" aria-label="Cargando estado del servicio">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-2/3 max-w-sm" />
            </div>
          ) : null}

          {isError ? (
            <Alert variant={showStaleError ? "default" : "destructive"}>
              <AlertCircle aria-hidden />
              <AlertTitle>
                {showStaleError ? "No se pudo actualizar el estado" : "No se pudo obtener el estado"}
              </AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{getErrorMessage(error)}</p>
                {!showStaleError ? (
                  isLikelyNetworkOrCors(getErrorMessage(error)) ? (
                    <ul className="list-inside list-disc text-xs space-y-1 text-muted-foreground">
                      <li>
                        <code className="font-mono text-foreground">NEXT_PUBLIC_API_URL</code> debe
                        apuntar al <strong className="text-foreground">backend</strong> (p. ej.{" "}
                        <code className="font-mono text-foreground">:8000</code>), no al servidor de
                        Next (<code className="font-mono text-foreground">:3000</code>).
                      </li>
                      <li>
                        Con <code className="font-mono text-foreground">NEXT_PUBLIC_API_PROXY=true</code>{" "}
                        el navegador usa <code className="font-mono text-foreground">/petmind-api</code>{" "}
                        (misma origen) y se evita CORS; reinicia <code className="font-mono text-foreground">npm run dev</code> tras cambiar{" "}
                        <code className="font-mono text-foreground">next.config.ts</code> o variables.
                      </li>
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Revisa que el backend esté en marcha y que la URL sea correcta.
                    </p>
                  )
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Se muestran los datos de la última comprobación correcta.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ) : null}

          {data ? <HealthResult data={data} /> : null}
        </CardContent>
        {isFetched && dataUpdatedAt > 0 ? (
          <CardFooter className="text-xs text-muted-foreground">
            Última respuesta correcta: {new Date(dataUpdatedAt).toLocaleString("es")}
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}

function HealthResult({ data }: { data: HealthResponse }) {
  const status =
    typeof data.status === "string" && data.status.length > 0 ? data.status : "—";
  const healthy = status !== "—" && isHealthyStatus(status);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Estado reportado:</span>
        <Badge variant={healthy ? "default" : "secondary"} className="font-mono text-xs">
          {status}
        </Badge>
        {healthy ? (
          <span className="text-sm text-muted-foreground">El servicio respondió correctamente.</span>
        ) : (
          <span className="text-sm text-amber-600 dark:text-amber-500">
            El backend respondió, pero el estado no parece «operativo». Revisa el despliegue.
          </span>
        )}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {data.version !== undefined && data.version !== "" ? (
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            <dt className="text-xs font-medium text-muted-foreground">Versión</dt>
            <dd className="font-mono text-sm">{data.version}</dd>
          </div>
        ) : null}
        {data.uptime_seconds !== undefined ? (
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            <dt className="text-xs font-medium text-muted-foreground">Tiempo activo</dt>
            <dd className="text-sm">
              {formatUptime(data.uptime_seconds)}{" "}
              <span className="text-muted-foreground font-mono text-xs">
                ({data.uptime_seconds} s)
              </span>
            </dd>
          </div>
        ) : null}
      </dl>

      <Separator />

      <details className="group rounded-lg border bg-muted/20 px-3 py-2 text-xs">
        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
          Respuesta JSON completa
        </summary>
        <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
