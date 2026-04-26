import type { Metadata } from "next";

import { HealthStatus } from "@/components/health/health-status";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = { title: "Estado del servicio" };

export default function HealthPage() {
  return (
    <PageShell
      title="Estado del servicio"
      description="Comprueba que el backend de PetMind AI responde en GET /api/v1/health."
    >
      <HealthStatus />
    </PageShell>
  );
}
