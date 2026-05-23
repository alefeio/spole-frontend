import { Suspense } from "react";
import { LoadingState } from "@/components/feedback/loading-state";
import { OwnerArenasCatalog } from "@/features/owner-arenas/components/owner-arenas-catalog";

export default function OwnerArenasListPage() {
  return (
    <Suspense fallback={<LoadingState label="Carregando suas arenas…" />}>
      <OwnerArenasCatalog />
    </Suspense>
  );
}
