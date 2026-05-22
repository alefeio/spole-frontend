const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  CONSUMED: "Utilizada"
};

export function ReservationStatusBadge({ status }: { status: string }) {
  return (
    <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
