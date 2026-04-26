import { cn } from "@/lib/utils";

interface PageShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ title, description, children, className }: PageShellProps) {
  return (
    <main className={cn("mx-auto w-full max-w-4xl px-4 py-8 flex-1", className)}>
      {(title || description) && (
        <header className="mb-6 space-y-1">
          {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
    </main>
  );
}
