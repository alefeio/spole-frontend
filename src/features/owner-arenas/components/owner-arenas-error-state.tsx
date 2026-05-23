import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type OwnerArenasErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function OwnerArenasErrorState({ error, onRetry }: OwnerArenasErrorStateProps) {
  return (
    <section className="space-y-4 rounded-xl border p-6">
      <p className="text-destructive text-sm" role="alert">
        {getApiErrorMessage(error)}
      </p>
      {onRetry ? (
        <Button type="button" variant="outline" className="min-h-11" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </section>
  );
}
