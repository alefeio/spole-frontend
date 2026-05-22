"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import { PaymentCard } from "@/features/payments/components/payment-card";
import { useCreatePaymentForBooking } from "@/features/payments/hooks";
import type { Payment } from "@/features/payments/types";

type CheckoutPaymentCardProps = {
  bookingId: string;
};

export function CheckoutPaymentCard({ bookingId }: CheckoutPaymentCardProps) {
  const createPaymentMutation = useCreatePaymentForBooking();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleCreatePayment() {
    setMessage(null);
    createPaymentMutation.mutate(
      { bookingId },
      {
        onSuccess: (createdPayment) => {
          setPayment(createdPayment);
          setMessage("Pagamento mock criado com status pendente.");
        },
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="text-lg font-semibold">Pagamento mock</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          O backend permite criar um pagamento pendente com PIX e mock-provider. A confirmacao
          depende do webhook do backend e nao e simulada no browser.
        </p>
      </div>

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      {payment ? <PaymentCard payment={payment} /> : null}

      <Button
        type="button"
        className="min-h-11 w-full sm:min-h-9 sm:w-auto"
        disabled={createPaymentMutation.isPending || Boolean(payment)}
        onClick={handleCreatePayment}
      >
        {createPaymentMutation.isPending ? "Criando pagamento..." : "Iniciar pagamento mock"}
      </Button>
    </section>
  );
}
