import { ParticipantCard } from "@/features/participants/components/participant-card";
import type { EventParticipant } from "@/features/participants/types";

export function ParticipantList({ participants }: { participants: EventParticipant[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {participants.map((participant) => (
        <ParticipantCard key={participant.id} participant={participant} />
      ))}
    </div>
  );
}
