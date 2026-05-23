import { Badge } from "@/components/ui/badge";
import type { AdminUserRole } from "@/features/admin-users/types";

const LABELS: Record<AdminUserRole, string> = {
  user: "Participante",
  arena_owner: "Dono de arena",
  admin: "Administrador"
};

export function AdminUserRoleBadge({ role }: { role: AdminUserRole }) {
  return <Badge variant="outline">{LABELS[role] ?? role}</Badge>;
}
