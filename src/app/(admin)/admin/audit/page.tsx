import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { AdminAuditCatalog } from "@/features/admin-audit/components/admin-audit-catalog";

export default function AdminAuditPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando auditoria…" />}>
      <AdminAuditCatalog />
    </Suspense>
  );
}
