import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type ArenasErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ArenasErrorState({ error, onRetry }: ArenasErrorStateProps) {
  return (
    <div className="space-y-4 rounded-xl border p-6">
      <p className="text-destructive text-sm" role="alert">
        {getApiErrorMessage(error, "Não foi possível carregar as arenas.")}
      </p>
      {onRetry ? (
        <Button type="button" variant="outline" className="min-h-11" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
