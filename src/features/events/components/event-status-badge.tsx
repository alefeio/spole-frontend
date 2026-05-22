import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/features/events/types";

const LABELS: Record<EventStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  CANCELLED: "Cancelado"
};

const VARIANTS: Record<EventStatus, "default" | "success" | "destructive"> = {
  DRAFT: "default",
  PUBLISHED: "success",
  CANCELLED: "destructive"
};

type EventStatusBadgeProps = {
  status: EventStatus;
};

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status] ?? status}</Badge>;
}
