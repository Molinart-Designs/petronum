/**
 * Claves centralizadas para TanStack Query.
 *
 * Mantenerlas aquí evita strings sueltos en componentes y facilita
 * invalidaciones consistentes desde mutaciones.
 */
export const queryKeys = {
  health: () => ["health"] as const,
  query: (question: string) => ["query", question] as const,
} as const;
