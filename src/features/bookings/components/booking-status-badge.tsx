import type { BookingStatus } from "@/features/bookings/types";

const STATUS_LABELS: Record<BookingStatus, string> = {
  RESERVED: "Reservado",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado",
  COMPLETED: "Concluído"
};

export function BookingStatusBadge({ status }: { status: BookingStatus | string }) {
  return (
    <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
      {STATUS_LABELS[status as BookingStatus] ?? status}
    </span>
  );
}
