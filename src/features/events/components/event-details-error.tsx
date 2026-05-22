import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type EventDetailsErrorProps = {
  error: unknown;
  onRetry: () => void;
  fallbackMessage?: string;
};

export function EventDetailsError({ error, onRetry, fallbackMessage }: EventDetailsErrorProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 mx-auto max-w-xl space-y-4 rounded-xl border p-8 text-center">
      <h1 className="text-destructive text-2xl font-bold tracking-tight">
        Não foi possível carregar o evento
      </h1>
      <p className="text-muted-foreground text-sm">
        {fallbackMessage ?? getApiErrorMessage(error)}
      </p>
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        <Button type="button" className="min-h-11 sm:min-h-9" onClick={onRetry}>
          Tentar novamente
        </Button>
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/events">Voltar ao catálogo</Link>
        </Button>
      </div>
    </div>
  );
}
