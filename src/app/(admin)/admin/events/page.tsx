import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { AdminEventsCatalog } from "@/features/admin-events/components/admin-events-catalog";

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando eventos…" />}>
      <AdminEventsCatalog />
    </Suspense>
  );
}
