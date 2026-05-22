"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { EventForm, mapMutationError } from "@/features/events/components/event-form";
import { buildOrganizerEventPath } from "@/features/events/event-links";
import { useEvent, useEventCategories, useUpdateEvent } from "@/features/events/hooks";
import { getApiErrorMessage, isNotFoundError } from "@/lib/api/error-messages";
import { ApiError } from "@/lib/api/errors";

type EditOrganizerEventPageProps = {
  params: Promise<{ eventId: string }>;
};

export default function EditOrganizerEventPage({ params }: EditOrganizerEventPageProps) {
  const { eventId } = use(params);
  const router = useRouter();
  const eventQuery = useEvent(eventId);
  const categoriesQuery = useEventCategories();
  const updateMutation = useUpdateEvent(eventId);
  const [formError, setFormError] = useState<string | null>(null);

  const event = eventQuery.data;
  const cancelled = event?.status === "CANCELLED";

  return (
    <div className="space-y-6 overflow-x-hidden">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Editar evento</h1>
        <p className="text-muted-foreground text-sm">
          Alterações enviadas via PATCH. Cancelamento usa ação separada no detalhe.
        </p>
      </header>

      {eventQuery.isLoading || categoriesQuery.isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando…</p>
      ) : null}

      {eventQuery.isError ? (
        <div className="space-y-3 rounded-xl border p-4">
          <p className="text-destructive text-sm" role="alert">
            {eventQuery.error instanceof ApiError && eventQuery.error.status === 403
              ? "Você não tem permissão para editar este evento."
              : isNotFoundError(eventQuery.error)
                ? "Evento não encontrado."
                : getApiErrorMessage(eventQuery.error)}
          </p>
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href="/account/events">← Meus eventos</Link>
          </Button>
        </div>
      ) : null}

      {cancelled ? (
        <p className="rounded-lg border p-4 text-sm">
          Este evento está cancelado e não pode ser editado.
        </p>
      ) : null}

      {formError ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      {event && categoriesQuery.isSuccess && !cancelled ? (
        <EventForm
          mode={{ kind: "edit", event }}
          categories={categoriesQuery.data}
          isPending={updateMutation.isPending}
          onSubmitCreateFree={() => {}}
          onSubmitCreateArena={() => {}}
          onSubmitUpdate={(payload) => {
            setFormError(null);
            updateMutation.mutate(payload, {
              onSuccess: () => router.replace(buildOrganizerEventPath(eventId)),
              onError: (error) => setFormError(mapMutationError(error))
            });
          }}
        />
      ) : null}

      {event && !cancelled ? (
        <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
          <Link href={buildOrganizerEventPath(eventId)}>← Voltar ao detalhe</Link>
        </Button>
      ) : null}
    </div>
  );
}
