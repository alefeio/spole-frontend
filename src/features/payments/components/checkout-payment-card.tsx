"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isMockPaymentsDevMode } from "@/lib/payments/payment-provider";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import { createIdempotencyKey } from "@/lib/api/idempotency";
import { PixCheckoutPanel } from "@/features/payments/components/pix-checkout-panel";
import { useCreatePaymentForBooking, usePayment } from "@/features/payments/hooks";
import { getPaymentPollTimeoutMessage } from "@/features/payments/polling-messages";
import {
  isPendingPaymentStatus,
  isTerminalPaymentStatus
} from "@/features/payments/payment-status";
import { getPaymentTerminalMessage } from "@/features/payments/payment-status-labels";

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
      ? getPaymentTerminalMessage(payment.status)
      : null;

  function handleCreatePayment() {
    setActionMessage(null);
    createPaymentMutation.mutate(
      { bookingId, idempotencyKey: createIdempotencyKey() },
      {
        onSuccess: (createdPayment) => {
          setCreatedPaymentId(createdPayment.id);
          setActionMessage(
            "Pagamento Pix gerado. Conclua o pagamento no app do seu banco e aguarde a confirmação."
          );
        },
        onError: (error) => setActionMessage(getApiErrorMessage(error))
      }
    );
  }

  const hasPayment = Boolean(payment);
  const canCreate = !hasPayment && !createPaymentMutation.isPending;
  const devMock = isMockPaymentsDevMode();

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="text-lg font-semibold">Pagar com Pix</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Gere o código Pix para concluir sua inscrição. A confirmação depende do processamento do
          pagamento — não há aprovação manual nesta tela.
        </p>
        {devMock ? (
          <p className="text-muted-foreground mt-2 text-xs">
            Ambiente de desenvolvimento: o backend pode usar provedor simulado. Em homologação real,
            configure o servidor com Asaas.
          </p>
        ) : null}
      </div>

      {actionMessage ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {actionMessage}
        </p>
      ) : null}

      {terminalMessage && !actionMessage ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {terminalMessage}
        </p>
      ) : null}

      {paymentQuery.pollTimedOut && payment && isPendingPaymentStatus(payment.status) ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {getPaymentPollTimeoutMessage()}
        </p>
      ) : null}

      {payment ? <PixCheckoutPanel payment={payment} isPolling={isPolling} /> : null}

      {canCreate ? (
        <Button
          type="button"
          className="min-h-11 w-full sm:min-h-9 sm:w-auto"
          disabled={createPaymentMutation.isPending}
          onClick={handleCreatePayment}
        >
          {createPaymentMutation.isPending ? "Gerando pagamento…" : "Pagar com Pix"}
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
