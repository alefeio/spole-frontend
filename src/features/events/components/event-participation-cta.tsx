"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingHoldConfirmation } from "@/features/bookings/components/booking-hold-confirmation";
import { useCreateBooking } from "@/features/bookings/hooks";
import type { Booking } from "@/features/bookings/types";
import { useMe } from "@/features/auth/hooks";
import { useJoinFreeEvent } from "@/features/events/hooks";
import type { EventDetails } from "@/features/events/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

type EventParticipationCtaProps = {
  event: EventDetails;
  privateCode?: string;
};

export function EventParticipationCta({ event, privateCode }: EventParticipationCtaProps) {
  const { data: user } = useMe();
  const joinFreeMutation = useJoinFreeEvent();
  const createBookingMutation = useCreateBooking();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitting = joinFreeMutation.isPending || createBookingMutation.isPending;
  const isUnavailable = event.status !== "PUBLISHED";

  function handleParticipate() {
    setSuccessMessage(null);
    setCreatedBooking(null);
    setErrorMessage(null);

    if (event.type === "FREE") {
      joinFreeMutation.mutate(
        { eventId: event.id, privateCode },
        {
          onSuccess: () => {
            setSuccessMessage("Inscrição confirmada com sucesso.");
          },
          onError: (error) => {
            setErrorMessage(getApiErrorMessage(error));
          }
        }
      );
      return;
    }

    createBookingMutation.mutate(
      { eventId: event.id, privateCode },
      {
        onSuccess: (booking) => {
          setCreatedBooking(booking);
          setSuccessMessage("Vaga reservada temporariamente.");
        },
        onError: (error) => {
          setErrorMessage(getApiErrorMessage(error));
        }
      }
    );
  }

  return (
    <section className="bg-muted/40 space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="font-semibold">Participação</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {user ? (
            <>
              {event.type === "FREE"
                ? "Inscreva-se gratuitamente usando o fluxo real da API."
                : "Crie uma reserva temporária para este evento pago. Checkout fica para uma próxima etapa."}
            </>
          ) : (
            "Entre ou crie sua conta para participar deste evento."
          )}
        </p>
      </div>

      {successMessage ? (
        <div className="border-primary/30 bg-primary/5 text-primary rounded-lg border p-3 text-sm font-medium">
          {successMessage}
        </div>
      ) : null}

      {createdBooking ? <BookingHoldConfirmation booking={createdBooking} /> : null}

      {errorMessage ? (
        <p className="text-destructive border-destructive/30 bg-destructive/5 rounded-lg border p-3 text-sm">
          {errorMessage}
        </p>
      ) : null}

      {isUnavailable ? (
        <p className="text-muted-foreground rounded-lg border p-3 text-sm">
          Este evento não está disponível para participação no momento.
        </p>
      ) : user ? (
        <Button
          type="button"
          disabled={isSubmitting}
          className="min-h-11 w-full"
          onClick={handleParticipate}
        >
          {isSubmitting
            ? "Enviando…"
            : event.type === "FREE"
              ? "Participar gratuitamente"
              : "Reservar vaga temporária"}
        </Button>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild className="min-h-11">
            <Link href={`/login?redirect=/events/${event.id}`}>Entrar para participar</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
