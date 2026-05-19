import { ErrorState } from "@/components/feedback/section-state";

export function PaymentsErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <ErrorState title="Nao foi possivel carregar seus pagamentos" error={error} onRetry={onRetry} />
  );
}
