import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  AVAILABLE: "Disponível"
};

export function OwnerSlotStatusBadge({ status }: { status: string }) {
  const variant = status === "AVAILABLE" ? "success" : "outline";
  return <Badge variant={variant}>{LABELS[status] ?? status}</Badge>;
}
