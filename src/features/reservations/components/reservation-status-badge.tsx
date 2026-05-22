import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  CONSUMED: "Utilizada"
};

const STATUS_VARIANT: Record<
  string,
  "accent" | "success" | "destructive" | "muted" | "secondary" | "warning"
> = {
  PENDING: "accent",
  CONFIRMED: "success",
  CANCELLED: "secondary",
  CONSUMED: "muted"
};

export function ReservationStatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status] ?? "secondary";

  return <Badge variant={variant}>{STATUS_LABELS[status] ?? status}</Badge>;
}
