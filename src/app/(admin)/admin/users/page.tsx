import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { AdminUsersCatalog } from "@/features/admin-users/components/admin-users-catalog";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando usuários…" />}>
      <AdminUsersCatalog />
    </Suspense>
  );
}
