import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { AdminBookingsCatalog } from "@/features/admin-bookings/components/admin-bookings-catalog";

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando bookings…" />}>
      <AdminBookingsCatalog />
    </Suspense>
  );
}
