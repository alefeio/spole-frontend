"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EventForm, mapMutationError } from "@/features/events/components/event-form";
import { buildOrganizerEventPath } from "@/features/events/event-links";
import { useCreateEvent, useEventCategories } from "@/features/events/hooks";
import { useReservation } from "@/features/reservations/hooks";

function formatSlotWindow(slot?: { startAt: string; endAt: string }) {
  if (!slot) return "Horário não informado";
  const fmt = (value: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  return `${fmt(slot.startAt)} – ${fmt(slot.endAt)}`;
}

type CreateEventFromReservationPageProps = {
  params: Promise<{ reservationId: string }>;
};

export default function CreateEventFromReservationPage({
  params
}: CreateEventFromReservationPageProps) {
  const { reservationId } = use(params);
  const router = useRouter();
  const reservationQuery = useReservation(reservationId);
  const categoriesQuery = useEventCategories();
  const createMutation = useCreateEvent();
  const [formError, setFormError] = useState<string | null>(null);

  const reservation = reservationQuery.data;
  const isConfirmed = reservation?.status === "CONFIRMED";

  const locationLabel = useMemo(() => {
    if (!reservation) return "Local da arena (definido pela reserva)";
    return "Endereço herdado da arena ao criar o evento";
  }, [reservation]);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Criar evento na reserva</h1>
        <p className="text-muted-foreground text-sm">
          Vincula um evento à reserva confirmada. Após criar, a reserva pode passar para CONSUMED na
          API.
        </p>
      </header>

      {reservationQuery.isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando reserva…</p>
      ) : null}

      {reservationQuery.isError ? (
        <p className="text-destructive text-sm" role="alert">
          {mapMutationError(reservationQuery.error)}
        </p>
      ) : null}

      {reservation && !isConfirmed ? (
        <section className="space-y-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm font-medium">Reserva não confirmada</p>
          <p className="text-muted-foreground text-sm">
            Esta reserva precisa estar confirmada para gerar um evento. Status atual:{" "}
            {reservation.status}.
          </p>
          <Button asChild variant="outline" className="min-h-11">
            <Link href={`/account/reservations/${reservationId}`}>Voltar à reserva</Link>
          </Button>
        </section>
      ) : null}

      {formError ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      {reservation && isConfirmed && categoriesQuery.isSuccess ? (
        <EventForm
          mode={{
            kind: "create-arena",
            reservationId,
            slotLabel: formatSlotWindow(reservation.slot),
            locationLabel
          }}
          categories={categoriesQuery.data}
          isPending={createMutation.isPending}
          onSubmitCreateFree={() => {}}
          onSubmitCreateArena={(payload) => {
            setFormError(null);
            createMutation.mutate(payload, {
              onSuccess: (data) => {
                router.replace(buildOrganizerEventPath(data.id));
              },
              onError: (error) => setFormError(mapMutationError(error))
            });
          }}
          onSubmitUpdate={() => {}}
        />
      ) : null}

      {categoriesQuery.isLoading && reservation && isConfirmed ? (
        <p className="text-muted-foreground text-sm">Carregando categorias…</p>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
        <Link href={`/account/reservations/${reservationId}`}>← Voltar à reserva</Link>
      </Button>
    </div>
  );
}
