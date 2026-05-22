import { ErrorState } from "@/components/feedback/section-state";

export function ReservationsErrorState({
  error,
  onRetry
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <ErrorState title="Não foi possível carregar suas reservas" error={error} onRetry={onRetry} />
  );
}
