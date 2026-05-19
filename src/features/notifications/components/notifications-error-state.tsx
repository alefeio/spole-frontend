import { ErrorState } from "@/components/feedback/section-state";

export function NotificationsErrorState({
  error,
  onRetry
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <ErrorState
      title="Nao foi possivel carregar suas notificacoes"
      error={error}
      onRetry={onRetry}
    />
  );
}
