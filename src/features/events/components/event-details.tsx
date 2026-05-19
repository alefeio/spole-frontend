"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import { EventDateLocation } from "@/features/events/components/event-date-location";
import { EventDetailsError } from "@/features/events/components/event-details-error";
import { EventDetailsSkeleton } from "@/features/events/components/event-details-skeleton";
import { EventInfoCard } from "@/features/events/components/event-info-card";
import { EventNotFoundState } from "@/features/events/components/event-not-found-state";
import { EventParticipationCta } from "@/features/events/components/event-participation-cta";
import { EventPriceBadge } from "@/features/events/components/event-price-badge";
import { useEvent } from "@/features/events/hooks";

type EventDetailsProps = {
  eventId: string;
  privateCode?: string;
};

export function EventDetails({ eventId, privateCode }: EventDetailsProps) {
  const eventQuery = useEvent(eventId, { privateCode });

  if (eventQuery.isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (eventQuery.isError) {
    if (eventQuery.error instanceof ApiError && eventQuery.error.status === 404) {
      return <EventNotFoundState />;
    }

    return <EventDetailsError error={eventQuery.error} onRetry={() => void eventQuery.refetch()} />;
  }

  const event = eventQuery.data;

  if (!event) {
    return <EventNotFoundState />;
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
        <Link href="/events">← Voltar ao catálogo</Link>
      </Button>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <EventPriceBadge type={event.type} pricePerPerson={event.pricePerPerson} />
          <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium">
            {event.visibility === "PUBLIC" ? "Público" : "Privado"}
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight break-words sm:text-4xl">
            {event.title}
          </h1>
          <p className="text-muted-foreground">
            {event.description || "Este evento ainda não possui descrição detalhada."}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <main className="space-y-6">
          <EventDateLocation event={event} />

          <section className="rounded-xl border p-4">
            <h2 className="font-semibold">Sobre o evento</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {event.description || "Mais informações serão adicionadas pelo organizador."}
            </p>
          </section>
        </main>

        <aside className="space-y-4">
          <EventParticipationCta event={event} privateCode={privateCode} />
          <EventInfoCard event={event} />
        </aside>
      </div>
    </div>
  );
}
