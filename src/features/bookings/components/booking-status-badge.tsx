import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/features/bookings/types";

const STATUS_LABELS: Record<BookingStatus, string> = {
  RESERVED: "Reservado",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado",
  COMPLETED: "Concluído"
};

const STATUS_VARIANT: Record<
  BookingStatus,
  "accent" | "success" | "destructive" | "muted" | "secondary" | "warning"
> = {
  RESERVED: "accent",
  EXPIRED: "warning",
  CANCELLED: "secondary",
  COMPLETED: "success"
};

export function BookingStatusBadge({ status }: { status: BookingStatus | string }) {
  const key = status as BookingStatus;
  const variant = STATUS_VARIANT[key] ?? "secondary";

  return <Badge variant={variant}>{STATUS_LABELS[key] ?? status}</Badge>;
}
