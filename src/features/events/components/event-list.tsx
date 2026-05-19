import { EventCard } from "@/features/events/components/event-card";
import type { Event } from "@/features/events/types";

type EventListProps = {
  events: Event[];
};

export function EventList({ events }: EventListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
