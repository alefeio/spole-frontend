"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { CardsSkeleton } from "@/components/feedback/section-state";
import { ReservationCheckoutPaymentCard } from "@/features/payments/components/reservation-checkout-payment-card";
import { ReservationCheckoutSummary } from "@/features/payments/components/reservation-checkout-summary";
import { ReservationDetailError } from "@/features/reservations/components/reservation-detail-error";
import { useReservation } from "@/features/reservations/hooks";

type ReservationPaymentPageProps = {
  params: Promise<{ reservationId: string }>;
};

export default function ReservationPaymentPage({ params }: ReservationPaymentPageProps) {
  const { reservationId } = use(params);
  const reservationQuery = useReservation(reservationId);
  const reservation = reservationQuery.data;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
          <Link href={`/account/reservations/${reservationId}`}>
            ← Voltar ao detalhe da reserva
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pagamento da reserva</h1>
          <p className="text-muted-foreground text-sm">
            Checkout mock para reserva de arena. A confirmação depende do processamento no backend,
            não deste navegador.
          </p>
        </div>
      </header>

      {reservationQuery.isLoading ? <CardsSkeleton count={2} /> : null}

      {reservationQuery.isError ? (
        <ReservationDetailError
          error={reservationQuery.error}
          onRetry={() => void reservationQuery.refetch()}
        />
      ) : null}

      {reservationQuery.isSuccess && reservation ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <ReservationCheckoutSummary reservation={reservation} />
          <ReservationCheckoutPaymentCard reservation={reservation} />
        </div>
      ) : null}
    </div>
  );
}
