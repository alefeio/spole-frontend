"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { PaymentDetail } from "@/features/payments/components/payment-detail";
import { PaymentDetailError } from "@/features/payments/components/payment-detail-error";
import { PaymentDetailSkeleton } from "@/features/payments/components/payment-detail-skeleton";
import { usePayment } from "@/features/payments/hooks";
import { isPendingPaymentStatus } from "@/features/payments/payment-status";

type PaymentDetailPageProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

export default function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const { paymentId } = use(params);
  const paymentQuery = usePayment(paymentId, { pollWhilePending: true });
  const payment = paymentQuery.data;
  const isPolling =
    paymentQuery.isFetching && payment !== undefined && isPendingPaymentStatus(payment.status);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
          <Link href="/account/payments">← Voltar para meus pagamentos</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Detalhe do pagamento</h1>
          <p className="text-muted-foreground text-sm">
            Status, valores e vínculos com reserva ou inscrição.
          </p>
        </div>
      </header>

      {paymentQuery.isLoading ? <PaymentDetailSkeleton /> : null}

      {paymentQuery.isError ? (
        <PaymentDetailError
          error={paymentQuery.error}
          onRetry={() => void paymentQuery.refetch()}
        />
      ) : null}

      {paymentQuery.isSuccess && payment ? (
        <PaymentDetail
          payment={payment}
          isPolling={isPolling}
          pollTimedOut={paymentQuery.pollTimedOut}
        />
      ) : null}
    </div>
  );
}
