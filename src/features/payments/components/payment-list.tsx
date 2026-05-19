import { PaymentCard } from "@/features/payments/components/payment-card";
import type { Payment } from "@/features/payments/types";

export function PaymentList({ payments }: { payments: Payment[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {payments.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} />
      ))}
    </div>
  );
}
