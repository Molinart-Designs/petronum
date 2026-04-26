import type { Metadata } from "next";

import { PetProfileForm } from "@/components/pet-profile/pet-profile-form";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = { title: "Perfil de mascota" };

export default function ProfilePage() {
  return (
    <PageShell
      title="Perfil de tu mascota"
      description="Los datos se guardan en este navegador y se adjuntan a tus consultas cuando lo indiques."
    >
      <PetProfileForm />
    </PageShell>
  );
}
