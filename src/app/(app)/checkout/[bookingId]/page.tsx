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
  const totalLoaded = bookingsQuery.data?.meta.total ?? 0;
  const mayBeBeyondFirstPage = totalLoaded > 100;

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
          title="Não foi possível carregar a reserva"
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
        <div className="space-y-4 rounded-xl border p-6 text-center">
          <h2 className="text-lg font-semibold">Reserva não encontrada nesta página</h2>
          <p className="text-muted-foreground text-sm">
            Não encontramos esta reserva entre as suas inscrições recentes (até 100 itens
            carregados). Ela pode ter expirado, sido cancelada ou estar em outra página da lista.
            {mayBeBeyondFirstPage
              ? " Você tem mais de 100 reservas — abra a lista completa em Minhas inscrições."
              : null}
          </p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button asChild className="min-h-11 sm:min-h-9">
              <Link href="/account/bookings">Ir para minhas inscrições</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
              <Link href="/events">Explorar eventos</Link>
            </Button>
          </div>
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
          <section className="space-y-3 rounded-xl border p-4">
            <h2 className="font-semibold">Pagamento indisponível</h2>
            <p className="text-muted-foreground text-sm">
              Esta reserva está com status <strong>{booking.status}</strong>. Só reservas{" "}
              <strong>RESERVED</strong> permitem gerar pagamento com Pix.
            </p>
            <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
              <Link href="/account/bookings">Ver minhas inscrições</Link>
            </Button>
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
        <Link href="/account/bookings">← Voltar para minhas inscrições</Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pagamento da inscrição</h1>
        <p className="text-muted-foreground text-sm">
          Pague com Pix para concluir sua reserva de evento. A confirmação depende do processamento
          do pagamento.
        </p>
      </div>
    </header>
  );
}
