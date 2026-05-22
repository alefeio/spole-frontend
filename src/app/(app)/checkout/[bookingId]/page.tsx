"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState, CardsSkeleton } from "@/components/feedback/section-state";
import { CheckoutBookingSummary } from "@/features/bookings/components/checkout-booking-summary";
import { useMyBookings } from "@/features/bookings/hooks";
import { CheckoutPaymentCard } from "@/features/payments/components/checkout-payment-card";

type CheckoutPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { bookingId } = use(params);
  const bookingsQuery = useMyBookings({ page: 1, limit: 100 });
  const booking = bookingsQuery.data?.data.find((item) => item.id === bookingId);

  if (bookingsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <CheckoutHeader />
        <CardsSkeleton count={2} />
      </div>
    );
  }

  if (bookingsQuery.isError) {
    return (
      <div className="space-y-6">
        <CheckoutHeader />
        <ErrorState
          title="Nao foi possivel carregar a reserva"
          error={bookingsQuery.error}
          onRetry={() => void bookingsQuery.refetch()}
        />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <CheckoutHeader />
        <div className="rounded-xl border p-6 text-center">
          <h2 className="text-lg font-semibold">Reserva nao encontrada</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            A API nao retornou esta reserva na lista do usuario autenticado.
          </p>
          <Button asChild className="mt-4 min-h-11 sm:min-h-9">
            <Link href="/account/bookings">Voltar para minhas inscricoes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const canCreatePayment = booking.status === "RESERVED";

  return (
    <div className="space-y-6">
      <CheckoutHeader />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <CheckoutBookingSummary booking={booking} />
        {canCreatePayment ? (
          <CheckoutPaymentCard bookingId={booking.id} />
        ) : (
          <section className="rounded-xl border p-4">
            <h2 className="font-semibold">Pagamento indisponivel</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Esta reserva esta com status {booking.status}. O frontend nao altera status
              manualmente.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function CheckoutHeader() {
  return (
    <header className="space-y-3">
      <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
        <Link href="/account/bookings">← Voltar para minhas inscricoes</Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Checkout mock</h1>
        <p className="text-muted-foreground text-sm">
          Crie um pagamento pendente para sua reserva de evento pago usando o fluxo mock do backend.
        </p>
      </div>
    </header>
  );
}
