import { Badge } from "@/components/ui/badge";
import type { EventVisibility } from "@/features/events/types";

const LABELS: Record<EventVisibility, string> = {
  PUBLIC: "Público",
  PRIVATE: "Privado"
};

type EventVisibilityBadgeProps = {
  visibility: EventVisibility;
};

export function EventVisibilityBadge({ visibility }: EventVisibilityBadgeProps) {
  return (
    <Badge variant={visibility === "PRIVATE" ? "default" : "outline"}>{LABELS[visibility]}</Badge>
  );
}
