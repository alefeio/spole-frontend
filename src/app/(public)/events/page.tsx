import { Suspense } from "react";
import { EventListSkeleton } from "@/features/events/components/event-list-skeleton";
import { EventsCatalog } from "@/features/events/components/events-catalog";

export const metadata = {
  title: "Eventos"
};

export default function EventsCatalogPage() {
  return (
    <Suspense fallback={<EventListSkeleton />}>
      <EventsCatalog />
    </Suspense>
  );
}
