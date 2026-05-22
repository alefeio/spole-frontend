"use client";

import { use } from "react";
import { OrganizerEventDetailView } from "@/features/events/components/organizer-event-detail";
import { useEvent } from "@/features/events/hooks";

type OrganizerEventDetailPageProps = {
  params: Promise<{ eventId: string }>;
};

export default function OrganizerEventDetailPage({ params }: OrganizerEventDetailPageProps) {
  const { eventId } = use(params);
  const eventQuery = useEvent(eventId);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Gerenciar evento</h1>
        <p className="text-muted-foreground text-sm">
          Visão do organizador conforme retorno da API.
        </p>
      </header>

      {eventQuery.isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando evento…</p>
      ) : null}

      {eventQuery.isError ? (
        <OrganizerEventDetailView
          loadError={eventQuery.error}
          onRetry={() => void eventQuery.refetch()}
        />
      ) : null}

      {eventQuery.isSuccess && eventQuery.data ? (
        <OrganizerEventDetailView event={eventQuery.data} />
      ) : null}
    </div>
  );
}
