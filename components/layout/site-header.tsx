import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { auth0 } from "@/lib/auth0";
import { isAdminUser } from "@/lib/auth/roles";
import { env } from "@/lib/env";

type Session = Awaited<ReturnType<typeof auth0.getSession>>;

export function SiteHeader({ session }: { session: Session }) {
  const admin = session?.user ? isAdminUser(session.user as Record<string, unknown>) : false;

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold"
          >
            PM
          </span>
          PetMind AI
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Principal">
          <Link
            href="/health"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Estado
          </Link>

          {session ? (
            <>
              <Link
                href="/app/dashboard"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Panel
              </Link>
              <Link
                href="/app/ask"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Consultar
              </Link>
              <Link
                href="/app/profile"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Mascota
              </Link>
              {admin ? (
                <Link
                  href="/app/admin/ingest"
                  className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Ingesta
                </Link>
              ) : null}
              <a
                href="/auth/logout"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Salir
              </a>
            </>
          ) : (
            <>
              <a href="/auth/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Entrar
              </a>
              <a
                href="/auth/login?screen_hint=signup"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Crear cuenta
              </a>
            </>
          )}
        </nav>

        {env.auth0.domain ? (
          <p className="sr-only">Auth0: {env.auth0.domain}</p>
        ) : null}
      </div>
    </header>
  );
}
