"use client";

import { use } from "react";
import { OwnerArenaDetailView } from "@/features/owner-arenas/components/owner-arena-detail-view";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";

type OwnerArenaDetailPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function OwnerArenaDetailPage({ params }: OwnerArenaDetailPageProps) {
  const { arenaId } = use(params);
  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => <OwnerArenaDetailView arena={arena} />}
    </OwnerArenaRouteShell>
  );
}
