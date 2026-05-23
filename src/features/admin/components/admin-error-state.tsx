"use client";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type AdminErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function AdminErrorState({ error, onRetry }: AdminErrorStateProps) {
  return (
    <div className="border-destructive/30 bg-destructive/5 space-y-3 rounded-xl border p-4">
      <p className="text-destructive text-sm" role="alert">
        {getApiErrorMessage(error)}
      </p>
      {onRetry ? (
        <Button type="button" variant="outline" className="min-h-11" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
