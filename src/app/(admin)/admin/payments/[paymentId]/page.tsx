"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { getPaymentById } from "@/features/payments/api";
import { PaymentDetail } from "@/features/payments/components/payment-detail";
import { isNotFoundError } from "@/lib/api/error-messages";

type AdminPaymentDetailPageProps = {
  params: Promise<{ paymentId: string }>;
};

export default function AdminPaymentDetailPage({ params }: AdminPaymentDetailPageProps) {
  const { paymentId } = use(params);
  const query = useQuery({
    queryKey: ["admin", "payment-detail", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId)
  });

  if (query.isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando pagamento…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
        {isNotFoundError(query.error) ? (
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href="/admin/payments">← Voltar para pagamentos</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  if (query.data) {
    return (
      <div className="space-y-6 overflow-x-hidden">
        <AdminPageHeader
          title="Pagamento"
          description="Visão administrativa — sem checkout nem webhook."
        />
        <PaymentDetail payment={query.data} variant="admin" />
        <Button asChild variant="ghost" className="min-h-11 px-0">
          <Link href="/admin/payments">← Voltar para pagamentos</Link>
        </Button>
      </div>
    );
  }

  return null;
}
