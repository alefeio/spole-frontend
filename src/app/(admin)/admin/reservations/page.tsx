import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { AdminReservationsCatalog } from "@/features/admin-reservations/components/admin-reservations-catalog";

export default function AdminReservationsPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando reservas…" />}>
      <AdminReservationsCatalog />
    </Suspense>
  );
}
