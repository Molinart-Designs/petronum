"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";

/**
 * Combina los providers de cliente que necesitan envolver toda la app.
 * Se usa una sola vez desde `app/layout.tsx`.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors closeButton position="bottom-right" />
    </QueryProvider>
  );
}
