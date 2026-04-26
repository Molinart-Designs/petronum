"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { Resolver } from "react-hook-form";
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
import { usePetProfile } from "@/hooks/use-pet-profile";
import type { PetProfile } from "@/lib/api/types";
import { petProfileSchema, type PetProfileInput } from "@/lib/schemas/pet-profile";

function toPetProfile(values: PetProfileInput): PetProfile {
  return {
    name: values.name.trim(),
    species: "dog",
    breed: values.breed?.trim() || undefined,
    ageYears: values.ageYears,
    weightKg: values.weightKg,
    notes: values.notes?.trim() || undefined,
  };
}

export function PetProfileForm() {
  const { profile, setProfile, clearProfile, isHydrated } = usePetProfile();

  const form = useForm<PetProfileInput>({
    resolver: zodResolver(petProfileSchema) as Resolver<PetProfileInput>,
    defaultValues: {
      name: "",
      species: "dog",
      breed: "",
      ageYears: undefined,
      weightKg: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    if (!isHydrated) return;
    form.reset({
      name: profile?.name ?? "",
      species: "dog",
      breed: profile?.breed ?? "",
      ageYears: profile?.ageYears,
      weightKg: profile?.weightKg,
      notes: profile?.notes ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo rehidratar cuando cambia el perfil persistido
  }, [isHydrated, profile]);

  function onSubmit(data: PetProfileInput) {
    const next = toPetProfile(data);
    setProfile(next);
    toast.success("Perfil guardado en este navegador.");
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Datos de la mascota</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="pet-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pet-name">Nombre</FieldLabel>
                  <Input {...field} id="pet-name" autoComplete="off" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="breed"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pet-breed">Raza (opcional)</FieldLabel>
                  <Input {...field} id="pet-breed" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="ageYears"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pet-age">Edad (años, opcional)</FieldLabel>
                  <Input
                    {...field}
                    id="pet-age"
                    type="number"
                    min={0}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="weightKg"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pet-weight">Peso (kg, opcional)</FieldLabel>
                  <Input
                    {...field}
                    id="pet-weight"
                    type="number"
                    min={0}
                    step={0.1}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pet-notes">Notas (opcional)</FieldLabel>
                  <Textarea {...field} id="pet-notes" rows={4} aria-invalid={fieldState.invalid} />
                  <FieldDescription>Máx. 500 caracteres. No compartas datos médicos sensibles si no quieres.</FieldDescription>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button type="submit" form="pet-profile-form">
          Guardar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            clearProfile();
            form.reset({
              name: "",
              species: "dog",
              breed: "",
              ageYears: undefined,
              weightKg: undefined,
              notes: "",
            });
            toast.message("Perfil borrado de este navegador.");
          }}
        >
          Borrar local
        </Button>
      </CardFooter>
    </Card>
  );
}
