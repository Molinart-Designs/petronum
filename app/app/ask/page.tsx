import type { Metadata } from "next";

import { AskPetMind } from "@/components/ask/ask-petmind";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = { title: "Consultar" };

export default function AskPage() {
  return (
    <PageShell
      title="Pregunta a PetMind"
      description="Escribe tu duda. La respuesta incluirá confianza, fuentes y avisos; no es un diagnóstico veterinario definitivo."
    >
      <AskPetMind />
    </PageShell>
  );
}
