import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type EmptyStateProps = {
  title: string;
  description: string;
};

type ErrorStateProps = {
  title: string;
  error: unknown;
  onRetry?: () => void;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="bg-muted/40 rounded-xl border p-6 text-center shadow-xs">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}

export function ErrorState({ title, error, onRetry }: ErrorStateProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 rounded-xl border p-6 text-center">
      <h2 className="text-destructive font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-sm">{getApiErrorMessage(error)}</p>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className="mt-4 min-h-11 sm:min-h-9"
          onClick={onRetry}
        >
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border p-4">
          <div className="bg-muted mb-3 h-5 w-32 animate-pulse rounded" />
          <div className="bg-muted mb-2 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
