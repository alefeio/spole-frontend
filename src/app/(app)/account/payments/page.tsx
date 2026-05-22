"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { PaymentList } from "@/features/payments/components/payment-list";
import { PaymentsEmptyState } from "@/features/payments/components/payments-empty-state";
import { PaymentsErrorState } from "@/features/payments/components/payments-error-state";
import { PaymentsSkeleton } from "@/features/payments/components/payments-skeleton";
import { useMyPayments } from "@/features/payments/hooks";

const DEFAULT_LIMIT = 10;

function parsePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function AccountPaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const paymentsQuery = useMyPayments({ page, limit: DEFAULT_LIMIT });
  const paymentsData = paymentsQuery.data;
  const payments = paymentsData?.data ?? [];

  function handlePageChange(nextPage: number) {
    const query = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) query.delete("page");
    else query.set("page", String(nextPage));
    const suffix = query.toString();
    router.push(suffix ? `/account/payments?${suffix}` : "/account/payments");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Meus pagamentos</h1>
        <p className="text-muted-foreground text-sm">
          Histórico de pagamentos de eventos e reservas de arena.
        </p>
      </header>

      {paymentsQuery.isLoading ? <PaymentsSkeleton /> : null}
      {paymentsQuery.isError ? (
        <PaymentsErrorState
          error={paymentsQuery.error}
          onRetry={() => void paymentsQuery.refetch()}
        />
      ) : null}
      {paymentsQuery.isSuccess && payments.length === 0 ? <PaymentsEmptyState /> : null}
      {paymentsData && payments.length > 0 ? (
        <div className="space-y-5">
          <PaymentList payments={payments} />
          <PaginationControls
            page={paymentsData.meta.page}
            limit={paymentsData.meta.limit}
            total={paymentsData.meta.total}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
}
