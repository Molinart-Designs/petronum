"use client";

import type { ComponentProps } from "react";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";

type Auth0ProviderProps = ComponentProps<typeof Auth0Provider>;

export function Auth0AppProvider({
  user,
  children,
}: Pick<Auth0ProviderProps, "user" | "children">) {
  return <Auth0Provider user={user}>{children}</Auth0Provider>;
}
