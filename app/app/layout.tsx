import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";

/**
 * Rutas autenticadas bajo `/app/*`.
 * Auth0 ya montó la sesión vía `proxy.ts`; si no hay sesión, al login universal.
 */
export default async function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }

  return <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</div>;
}
