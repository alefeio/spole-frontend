import { Badge } from "@/components/ui/badge";
import type { EventSourceType } from "@/features/events/types";

const LABELS: Record<EventSourceType, string> = {
  FREE_LOCATION: "Local livre",
  ARENA_RESERVATION: "Reserva de arena"
};

type EventOriginBadgeProps = {
  sourceType: EventSourceType;
};

export function EventOriginBadge({ sourceType }: EventOriginBadgeProps) {
  return <Badge variant="outline">{LABELS[sourceType] ?? sourceType}</Badge>;
}
