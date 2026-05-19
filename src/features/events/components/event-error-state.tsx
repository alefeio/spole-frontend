import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type EventErrorStateProps = {
  error: unknown;
  onRetry: () => void;
};

export function EventErrorState({ error, onRetry }: EventErrorStateProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 rounded-xl border p-8 text-center">
      <h2 className="text-destructive text-lg font-semibold">
        Não foi possível carregar os eventos
      </h2>
      <p className="text-muted-foreground mt-2 text-sm">{getApiErrorMessage(error)}</p>
      <Button type="button" className="mt-5" variant="outline" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}
