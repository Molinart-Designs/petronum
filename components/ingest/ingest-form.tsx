"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { postIngest } from "@/lib/api/ingest";
import type { IngestRequest } from "@/lib/api/types";
import { ingestSchema, type IngestInput } from "@/lib/schemas/ingest";

function toPayload(values: IngestInput): IngestRequest {
  const tags =
    values.tags
      ?.split(/[,;]+/)
      .map((t) => t.trim())
      .filter(Boolean) ?? [];
  return {
    title: values.title.trim(),
    content: values.content.trim(),
    source_url: values.source_url?.trim() || undefined,
    tags: tags.length ? tags : undefined,
  };
}

export function IngestForm() {
  const form = useForm<IngestInput>({
    resolver: zodResolver(ingestSchema),
    defaultValues: { title: "", content: "", source_url: "", tags: "" },
  });

  const mutation = useMutation({
    mutationFn: async (body: IngestRequest) => postIngest(body),
    onSuccess: (data) => {
      toast.success(data.message ?? "Ingesta enviada");
      form.reset();
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Error";
      toast.error(msg);
    },
  });

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base">Nuevo contenido</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="ingest-form" onSubmit={form.handleSubmit((v) => mutation.mutate(toPayload(v)))}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ing-title">Título</FieldLabel>
                  <Input {...field} id="ing-title" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ing-content">Contenido</FieldLabel>
                  <Textarea {...field} id="ing-content" rows={10} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="source_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ing-url">URL de origen (opcional)</FieldLabel>
                  <Input {...field} id="ing-url" type="url" placeholder="https://…" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ing-tags">Etiquetas (opcional)</FieldLabel>
                  <Input {...field} id="ing-tags" placeholder="vacunas, alimentación" aria-invalid={fieldState.invalid} />
                  <FieldDescription>Separadas por coma o punto y coma.</FieldDescription>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="ingest-form" disabled={mutation.isPending}>
          {mutation.isPending ? "Enviando…" : "Enviar ingesta"}
        </Button>
      </CardFooter>
    </Card>
  );
}
