import { ErrorState } from "@/components/feedback/section-state";

export function SlotsErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <ErrorState title="Não foi possível carregar os horários" error={error} onRetry={onRetry} />
  );
}
