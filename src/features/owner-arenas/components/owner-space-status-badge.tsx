import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  BLOCKED: "Bloqueado"
};

const VARIANTS: Record<string, "success" | "destructive" | "outline" | "default"> = {
  ACTIVE: "success",
  INACTIVE: "outline",
  BLOCKED: "destructive"
};

export function OwnerSpaceStatusBadge({ status }: { status: string }) {
  return <Badge variant={VARIANTS[status] ?? "outline"}>{LABELS[status] ?? status}</Badge>;
}
