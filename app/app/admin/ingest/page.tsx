import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { IngestForm } from "@/components/ingest/ingest-form";
import { PageShell } from "@/components/layout/page-shell";
import { auth0 } from "@/lib/auth0";
import { isAdminUser } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Ingesta (admin)" };

export default async function AdminIngestPage() {
  const session = await auth0.getSession();
  if (!session?.user || !isAdminUser(session.user as Record<string, unknown>)) {
    redirect("/app/dashboard");
  }

  return (
    <PageShell
      title="Ingesta de contenido"
      description="Solo administradores. El backend valida permisos con el mismo token Bearer."
    >
      <IngestForm />
    </PageShell>
  );
}
