"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import { BookingStatusBadge } from "@/features/bookings/components/booking-status-badge";
import { useCancelBooking } from "@/features/bookings/hooks";
import type { Booking } from "@/features/bookings/types";

type BookingCardProps = {
  booking: Booking;
};

function formatDate(value?: string) {
  if (!value) return "Não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function BookingCard({ booking }: BookingCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const cancelMutation = useCancelBooking();
  const canCancel = booking.status === "RESERVED";

  function handleCancel() {
    setMessage(null);
    cancelMutation.mutate(booking.id, {
      onSuccess: () => {
        setIsConfirming(false);
        setMessage("Reserva cancelada com sucesso.");
      },
      onError: (error) => setMessage(getApiErrorMessage(error))
    });
  }

  return (
    <article className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Evento</p>
          <Link
            href={`/events/${booking.eventId}`}
            className="font-medium break-all hover:underline"
          >
            {booking.eventId}
          </Link>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Reservado em</dt>
          <dd className="font-medium">{formatDate(booking.reservedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Expira em</dt>
          <dd className="font-medium">{formatDate(booking.expiresAt)}</dd>
        </div>
      </dl>

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      {isConfirming ? (
        <ConfirmDialog
          title="Cancelar reserva?"
          description="Esta ação usa o endpoint real de cancelamento e não pode ser desfeita pelo frontend."
          confirmLabel="Cancelar reserva"
          isPending={cancelMutation.isPending}
          onConfirm={handleCancel}
          onCancel={() => setIsConfirming(false)}
        />
      ) : canCancel ? (
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full sm:min-h-9 sm:w-auto"
          onClick={() => setIsConfirming(true)}
        >
          Cancelar reserva
        </Button>
      ) : null}
    </article>
  );
}
