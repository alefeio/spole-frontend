import Link from "next/link";
import type { EventParticipant } from "@/features/participants/types";

export function ParticipantCard({ participant }: { participant: EventParticipant }) {
  return (
    <article className="space-y-2 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Evento</p>
          <Link
            href={`/events/${participant.eventId}`}
            className="font-medium break-all hover:underline"
          >
            {participant.eventId}
          </Link>
        </div>
        <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
          {participant.status}
        </span>
      </div>
    </article>
  );
}
