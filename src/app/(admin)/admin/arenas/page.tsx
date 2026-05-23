import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { AdminArenasCatalog } from "@/features/admin-arenas/components/admin-arenas-catalog";

export default function AdminArenasPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando arenas…" />}>
      <AdminArenasCatalog />
    </Suspense>
  );
}
