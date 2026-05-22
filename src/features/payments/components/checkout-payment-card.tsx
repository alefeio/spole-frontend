"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import { createIdempotencyKey } from "@/lib/api/idempotency";
import { PaymentCard } from "@/features/payments/components/payment-card";
import { useCreatePaymentForBooking, usePayment } from "@/features/payments/hooks";
import { PAYMENT_POLL_TIMEOUT_MESSAGE } from "@/features/payments/polling-config";
import {
  isPendingPaymentStatus,
  isTerminalPaymentStatus
} from "@/features/payments/payment-status";

type CheckoutPaymentCardProps = {
  bookingId: string;
};

export function CheckoutPaymentCard({ bookingId }: CheckoutPaymentCardProps) {
  const createPaymentMutation = useCreatePaymentForBooking();
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const paymentQuery = usePayment(createdPaymentId ?? "", {
    pollWhilePending: Boolean(createdPaymentId)
  });

  const payment = paymentQuery.data ?? null;
  const isPolling =
    Boolean(createdPaymentId) &&
    paymentQuery.isFetching &&
    payment !== null &&
    isPendingPaymentStatus(payment.status);

  const terminalMessage =
    payment && isTerminalPaymentStatus(payment.status)
      ? payment.status === "PAID"
        ? "Pagamento confirmado."
        : `Status atualizado: ${payment.status}.`
      : null;

  const statusMessage = actionMessage ?? terminalMessage;

  function handleCreatePayment() {
    setActionMessage(null);
    createPaymentMutation.mutate(
      { bookingId, idempotencyKey: createIdempotencyKey() },
      {
        onSuccess: (createdPayment) => {
          setCreatedPaymentId(createdPayment.id);
          setActionMessage(
            "Pagamento mock criado. Acompanhamos o status automaticamente enquanto estiver pendente."
          );
        },
        onError: (error) => setActionMessage(getApiErrorMessage(error))
      }
    );
  }

  const hasPayment = Boolean(payment);
  const canCreate = !hasPayment && !createPaymentMutation.isPending;

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="text-lg font-semibold">Pagamento mock</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Crie um pagamento pendente com PIX e mock-provider. A confirmação final depende do
          processamento no backend — não há simulação de aprovação neste navegador.
        </p>
      </div>

      {statusMessage ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {statusMessage}
        </p>
      ) : null}

      {isPolling ? (
        <p className="text-muted-foreground text-sm" role="status">
          Atualizando status a cada poucos segundos…
        </p>
      ) : null}

      {paymentQuery.pollTimedOut && payment && isPendingPaymentStatus(payment.status) ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {PAYMENT_POLL_TIMEOUT_MESSAGE}
        </p>
      ) : null}

      {payment ? <PaymentCard payment={payment} /> : null}

      {canCreate ? (
        <Button
          type="button"
          className="min-h-11 w-full sm:min-h-9 sm:w-auto"
          disabled={createPaymentMutation.isPending}
          onClick={handleCreatePayment}
        >
          {createPaymentMutation.isPending ? "Criando pagamento…" : "Iniciar pagamento mock"}
        </Button>
      ) : null}

      {hasPayment ? (
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <Button asChild className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href={`/account/payments/${payment!.id}`}>Ver pagamento</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href="/account/payments">Ir para meus pagamentos</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9 sm:w-auto">
            <Link href="/account/bookings">Voltar para minhas inscrições</Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}
