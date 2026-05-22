import { OrganizerEventCard } from "@/features/events/components/organizer-event-card";
import type { OrganizerEventListItem } from "@/features/events/types";

type OrganizerEventsListProps = {
  events: OrganizerEventListItem[];
};

export function OrganizerEventsList({ events }: OrganizerEventsListProps) {
  return (
    <ul className="grid gap-4">
      {events.map((event) => (
        <li key={event.id}>
          <OrganizerEventCard event={event} />
        </li>
      ))}
    </ul>
  );
}
