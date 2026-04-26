import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth0 } from "@/lib/auth0";

const features = [
  {
    title: "Consultas fundamentadas",
    description: "Respuestas con nivel de confianza, fuentes y avisos veterinarios cuando aplique.",
  },
  {
    title: "Perfil de tu perro",
    description: "Contexto persistente en este dispositivo para preguntas más útiles.",
  },
  {
    title: "Privacidad de sesión",
    description: "Inicio de sesión con Auth0; el token de API no se expone al navegador.",
  },
] as const;

export default async function HomePage() {
  const session = await auth0.getSession();

  return (
    <PageShell>
      <section className="mb-10 rounded-2xl border bg-card p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          PetMind AI
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Cuidado inteligente para tu perro, con respuestas que puedes contrastar.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Pregunta sobre alimentación, comportamiento o señales de alerta. PetMind AI no sustituye
          el criterio clínico: muestra disclaimers y resalta cuándo conviene acudir al veterinario.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {session ? (
            <Link href="/app/dashboard" className={buttonVariants({ size: "lg" })}>
              Ir al panel
            </Link>
          ) : (
            <>
              <a href="/auth/login" className={buttonVariants({ size: "lg" })}>
                Entrar
              </a>
              <a href="/auth/login?screen_hint=signup" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Crear cuenta
              </a>
            </>
          )}
          <Link href="/health" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Estado del servicio
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto" />
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
