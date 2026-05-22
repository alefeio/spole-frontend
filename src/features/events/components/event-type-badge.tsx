import { Badge } from "@/components/ui/badge";
import type { EventType } from "@/features/events/types";

const LABELS: Record<EventType, string> = {
  FREE: "Gratuito",
  PAID: "Pago"
};

type EventTypeBadgeProps = {
  type: EventType;
};

export function EventTypeBadge({ type }: EventTypeBadgeProps) {
  return <Badge variant={type === "FREE" ? "success" : "accent"}>{LABELS[type] ?? type}</Badge>;
}
