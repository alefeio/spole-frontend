"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isMockPaymentsDevMode } from "@/lib/payments/payment-provider";
import { getApiErrorMessage, isPaymentAlreadyExistsError } from "@/lib/api/error-messages";
import { createIdempotencyKey } from "@/lib/api/idempotency";
import { findPaymentByReservationId } from "@/features/payments/api";
import { PixCheckoutPanel } from "@/features/payments/components/pix-checkout-panel";
import {
  useCreatePaymentForReservation,
  useReservationPaymentSync
} from "@/features/payments/hooks";
import { getPaymentPollTimeoutMessage } from "@/features/payments/polling-messages";
import {
  isPendingPaymentStatus,
  isTerminalPaymentStatus
} from "@/features/payments/payment-status";
import { getPaymentTerminalMessage } from "@/features/payments/payment-status-labels";
import { canCreateReservationPayment } from "@/features/reservations/reservation-payability";
import type { ReservationDetail } from "@/features/reservations/types";

type ReservationCheckoutPaymentCardProps = {
  reservation: ReservationDetail;
};

export function ReservationCheckoutPaymentCard({
  reservation
}: ReservationCheckoutPaymentCardProps) {
  const createPaymentMutation = useCreatePaymentForReservation();
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null);
  const [existingPaymentId, setExistingPaymentId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const activePaymentId = createdPaymentId ?? existingPaymentId;
  const paymentQuery = useReservationPaymentSync({
    reservationId: reservation.id,
    paymentId: activePaymentId,
    enabled: Boolean(activePaymentId)
  });

  const payment = paymentQuery.data ?? null;
  const isPolling =
    Boolean(activePaymentId) &&
    paymentQuery.isFetching &&
    payment !== null &&
    isPendingPaymentStatus(payment.status);

  const terminalMessage =
    payment && isTerminalPaymentStatus(payment.status)
      ? getPaymentTerminalMessage(payment.status)
      : null;

  const canPay = canCreateReservationPayment(reservation);
  const hasPayment = Boolean(payment);
  const canCreate = canPay && !hasPayment && !createPaymentMutation.isPending;
  const devMock = isMockPaymentsDevMode();

  async function handlePaymentAlreadyExists() {
    try {
      const existing = await findPaymentByReservationId(reservation.id);
      if (existing) {
        setExistingPaymentId(existing.id);
        setActionMessage(
          "Encontramos o pagamento existente desta reserva. Conclua o Pix abaixo ou acompanhe o status."
        );
        return;
      }
      setActionMessage(
        "Já existe um pagamento para esta reserva, mas não foi possível localizá-lo na lista. Abra Meus pagamentos."
      );
    } catch (error) {
      setActionMessage(getApiErrorMessage(error));
    }
  }

  function handleCreatePayment() {
    setActionMessage(null);
    createPaymentMutation.mutate(
      { reservationId: reservation.id, idempotencyKey: createIdempotencyKey() },
      {
        onSuccess: (createdPayment) => {
          setCreatedPaymentId(createdPayment.id);
          setActionMessage(
            "Pagamento Pix gerado. Conclua o pagamento no app do seu banco e aguarde a confirmação."
          );
        },
        onError: async (error) => {
          if (isPaymentAlreadyExistsError(error)) {
            await handlePaymentAlreadyExists();
            return;
          }
          setActionMessage(getApiErrorMessage(error));
        }
      }
    );
  }

  if (!canPay) {
    return (
      <section className="bg-muted/40 space-y-2 rounded-xl border p-4 text-sm">
        <h2 className="font-semibold">Pagamento indisponível</h2>
        <p className="text-muted-foreground">
          {reservation.status === "CONFIRMED"
            ? "Esta reserva já está confirmada."
            : reservation.status === "CANCELLED" || reservation.status === "CONSUMED"
              ? "Esta reserva não aceita pagamento no estado atual."
              : (reservation.financial?.requiredPaymentAmount ?? 0) <= 0
                ? "Esta reserva não exige pagamento (política da arena)."
                : "Esta reserva não está aberta para pagamento."}
        </p>
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href={`/account/reservations/${reservation.id}`}>Voltar ao detalhe</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="text-lg font-semibold">Pagar reserva com Pix</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Gere o código Pix para confirmar sua reserva de arena. A confirmação depende do
          processamento do pagamento.
        </p>
        {devMock ? (
          <p className="text-muted-foreground mt-2 text-xs">
            Ambiente de desenvolvimento: o backend pode usar provedor simulado.
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

      {isPolling ? (
        <p className="text-muted-foreground text-sm" role="status">
          Atualizando pagamento e reserva…
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
          className="min-h-11 w-full sm:min-h-9"
          disabled={createPaymentMutation.isPending}
          onClick={handleCreatePayment}
        >
          {createPaymentMutation.isPending ? "Gerando pagamento…" : "Pagar com Pix"}
        </Button>
      ) : null}

      {hasPayment ? (
        <div className="grid gap-2">
          <Button asChild className="min-h-11 w-full sm:min-h-9">
            <Link href={`/account/payments/${payment!.id}`}>Ver pagamento</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9">
            <Link href={`/account/reservations/${reservation.id}`}>Ver reserva</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9">
            <Link href="/account/payments">Meus pagamentos</Link>
          </Button>
        </div>
      ) : null}

      {existingPaymentId ? (
        <Button asChild variant="outline" className="min-h-11 w-full sm:min-h-9">
          <Link href={`/account/payments/${existingPaymentId}`}>Abrir pagamento existente</Link>
        </Button>
      ) : null}
    </section>
  );
}
