"use client";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type OrganizerEventsErrorStateProps = {
  error: unknown;
  onRetry: () => void;
};

export function OrganizerEventsErrorState({ error, onRetry }: OrganizerEventsErrorStateProps) {
  return (
    <section className="border-destructive/30 space-y-3 rounded-xl border p-4">
      <p className="text-destructive text-sm" role="alert">
        {getApiErrorMessage(error, "Não foi possível carregar seus eventos.")}
      </p>
      <Button type="button" variant="outline" className="min-h-11" onClick={onRetry}>
        Tentar novamente
      </Button>
    </section>
  );
}
