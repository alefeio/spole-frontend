import { ErrorState } from "@/components/feedback/section-state";

type OwnerArenasErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function OwnerArenasErrorState({ error, onRetry }: OwnerArenasErrorStateProps) {
  return (
    <ErrorState title="Não foi possível carregar suas arenas" error={error} onRetry={onRetry} />
  );
}
