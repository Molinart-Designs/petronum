"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { QueryResponsePanel } from "@/components/ask/query-response-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { usePetProfile } from "@/hooks/use-pet-profile";
import { ApiError } from "@/lib/api/client";
import { postQuery } from "@/lib/api/query";
import type { QueryRequest, QueryResponse } from "@/lib/api/types";
import { querySchema, type QueryInput } from "@/lib/schemas/query";

export function AskPetMind() {
  const { profile, isHydrated } = usePetProfile();
  const [attachProfile, setAttachProfile] = useState(true);

  const form = useForm<QueryInput>({
    resolver: zodResolver(querySchema),
    defaultValues: { question: "" },
  });

  const mutation = useMutation({
    mutationFn: async (payload: QueryRequest) => postQuery(payload),
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Error";
      toast.error(msg);
    },
    onSuccess: () => {
      toast.success("Respuesta recibida");
    },
  });

  function onSubmit(values: QueryInput) {
    const body: QueryRequest = {
      question: values.question.trim(),
      pet: attachProfile && profile ? profile : undefined,
    };
    mutation.mutate(body);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tu pregunta</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="ask-petmind-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <FieldGroup>
              <Controller
                name="question"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pm-question">Pregunta</FieldLabel>
                    <Textarea
                      {...field}
                      id="pm-question"
                      rows={6}
                      placeholder="Ej.: ¿Cuántas veces al día debería salir a pasear un cachorro de 4 meses?"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      {isHydrated && profile
                        ? "Puedes adjuntar el perfil guardado con la opción de abajo."
                        : "Configura el perfil en «Mascota» para enviar más contexto."}
                    </FieldDescription>
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Field orientation="horizontal">
                <input
                  id="pm-attach"
                  type="checkbox"
                  className="size-4 rounded border"
                  checked={attachProfile}
                  onChange={(e) => setAttachProfile(e.target.checked)}
                  disabled={!profile}
                />
                <FieldLabel htmlFor="pm-attach" className="font-normal">
                  Incluir perfil de mascota
                </FieldLabel>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="ask-petmind-form" disabled={mutation.isPending}>
            {mutation.isPending ? "Consultando…" : "Enviar a PetMind"}
          </Button>
        </CardFooter>
      </Card>

      <div className="min-h-[120px]">
        {mutation.isPending ? (
          <p className="text-sm text-muted-foreground">Generando respuesta…</p>
        ) : null}
        {mutation.data ? <QueryResponsePanel data={mutation.data as QueryResponse} /> : null}
      </div>
    </div>
  );
}
