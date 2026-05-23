import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  ACTIVE: "Ativa",
  INACTIVE: "Inativa"
};

export function OwnerArenaStatusBadge({ status }: { status: string }) {
  const variant = status === "ACTIVE" ? "success" : "destructive";
  return <Badge variant={variant}>{LABELS[status] ?? status}</Badge>;
}
