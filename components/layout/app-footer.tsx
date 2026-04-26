export function AppFooter() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted-foreground flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p>
          PetMind AI · Demo informativo. <span className="font-medium">No sustituye la consulta veterinaria.</span>
        </p>
        <p>Hecho con Next.js, Tailwind y shadcn/ui.</p>
      </div>
    </footer>
  );
}
