import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  CONSUMED: "Consumida"
};

const VARIANTS: Record<string, "success" | "destructive" | "outline" | "accent" | "default"> = {
  PENDING: "accent",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  CONSUMED: "outline"
};

export function OwnerReservationStatusBadge({ status }: { status: string }) {
  return <Badge variant={VARIANTS[status] ?? "outline"}>{LABELS[status] ?? status}</Badge>;
}
