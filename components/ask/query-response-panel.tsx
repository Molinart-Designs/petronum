"use client";

import { AlertCircle, BookOpen, ShieldAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PetMindConfidence, QueryResponse } from "@/lib/api/types";

function formatConfidence(value: PetMindConfidence | number | undefined): string {
  if (value === undefined) return "—";
  if (typeof value === "string") {
    const labels: Record<PetMindConfidence, string> = {
      low: "Baja",
      medium: "Media",
      high: "Alta",
    };
    return labels[value as PetMindConfidence] ?? value;
  }
  if (Number.isNaN(value)) return "—";
  if (value <= 1) return `${Math.round(value * 100)} %`;
  return `${Math.round(value)} %`;
}

export function QueryResponsePanel({ data }: { data: QueryResponse }) {
  const vet = Boolean(data.needs_vet_followup);

  return (
    <div className="space-y-4">
      {vet ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden />
          <AlertTitle>Posible seguimiento veterinario</AlertTitle>
          <AlertDescription>
            Esta respuesta sugiere consultar a un veterinario. PetMind AI no diagnostica de forma
            definitiva.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Respuesta</CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            Confianza: {formatConfidence(data.confidence)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-none whitespace-pre-wrap text-sm leading-relaxed">
            {data.answer}
          </div>

          {data.disclaimers?.length ? (
            <>
              <Separator />
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <div>
                  <p className="font-medium text-foreground">Avisos</p>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    {data.disclaimers.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}

          {data.sources?.length ? (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="size-4" aria-hidden />
                  Fuentes
                </p>
                <ul className="space-y-2 text-sm">
                  {data.sources.map((s, i) => (
                    <li key={s.id ?? `${s.title}-${i}`} className="rounded-lg border bg-muted/20 px-3 py-2">
                      {s.url ? (
                        <a href={s.url} className="font-medium text-primary hover:underline" target="_blank" rel="noreferrer">
                          {s.title}
                        </a>
                      ) : (
                        <span className="font-medium">{s.title}</span>
                      )}
                      {s.snippet ? <p className="mt-1 text-muted-foreground">{s.snippet}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
