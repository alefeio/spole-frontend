import { Badge } from "@/components/ui/badge";
import type { AdminUserStatus } from "@/features/admin-users/types";

const LABELS: Record<AdminUserStatus, string> = {
  ACTIVE: "Ativo",
  SUSPENDED: "Suspenso",
  INACTIVE: "Inativo"
};

const VARIANTS: Record<AdminUserStatus, "success" | "warning" | "destructive"> = {
  ACTIVE: "success",
  SUSPENDED: "warning",
  INACTIVE: "destructive"
};

export function AdminUserStatusBadge({ status }: { status: AdminUserStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status] ?? status}</Badge>;
}
