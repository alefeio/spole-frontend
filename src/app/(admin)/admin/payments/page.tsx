import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { AdminPaymentsCatalog } from "@/features/admin-payments/components/admin-payments-catalog";

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando pagamentos…" />}>
      <AdminPaymentsCatalog />
    </Suspense>
  );
}
