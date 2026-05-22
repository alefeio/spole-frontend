import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { OrganizerEventsCatalog } from "@/features/events/components/organizer-events-catalog";

export default function OrganizerEventsPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando seus eventos…" />}>
      <OrganizerEventsCatalog />
    </Suspense>
  );
}
