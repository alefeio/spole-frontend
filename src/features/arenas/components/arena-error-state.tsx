import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type ArenaErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ArenaErrorState({ error, onRetry }: ArenaErrorStateProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 mx-auto max-w-xl space-y-4 rounded-xl border p-8 text-center">
      <h2 className="text-destructive text-xl font-semibold">Não foi possível carregar a arena</h2>
      <p className="text-muted-foreground text-sm">{getApiErrorMessage(error)}</p>
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        {onRetry ? (
          <Button type="button" className="min-h-11 sm:min-h-9" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : null}
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/arenas">Voltar para arenas</Link>
        </Button>
      </div>
    </div>
  );
}
