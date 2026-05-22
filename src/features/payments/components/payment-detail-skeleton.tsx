import { CardsSkeleton } from "@/components/feedback/section-state";

export function PaymentDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-muted h-5 w-40 animate-pulse rounded" />
      <CardsSkeleton count={1} />
    </div>
  );
}
