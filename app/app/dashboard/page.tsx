import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth0 } from "@/lib/auth0";
import { isAdminUser } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Panel" };

export default async function DashboardPage() {
  const session = await auth0.getSession();
  const admin = session?.user ? isAdminUser(session.user as Record<string, unknown>) : false;

  return (
    <PageShell
      title={`Hola${session?.user?.name ? `, ${session.user.name}` : ""}`}
      description="Accede a las secciones principales de PetMind AI."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/app/ask">
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>Consultar</CardTitle>
              <CardDescription>Haz una pregunta sobre el cuidado de tu mascota.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/app/profile">
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>Perfil de mascota</CardTitle>
              <CardDescription>Actualiza el contexto que usamos en las consultas.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        {admin ? (
          <Link href="/app/admin/ingest">
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle>Ingesta (admin)</CardTitle>
                <CardDescription>Añade contenido a la base de conocimiento.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ) : null}
        <Link href="/health">
          <Card className="h-full transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>Estado del API</CardTitle>
              <CardDescription>Comprueba que el backend responde.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </PageShell>
  );
}
