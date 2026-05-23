"use client";

import { use } from "react";
import { OwnerSpaceSlotsView } from "@/features/owner-arenas/components/owner-space-slots-view";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";

type OwnerSpaceSlotsPageProps = {
  params: Promise<{ arenaId: string; spaceId: string }>;
};

export default function OwnerSpaceSlotsPage({ params }: OwnerSpaceSlotsPageProps) {
  const { arenaId, spaceId } = use(params);
  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => <OwnerSpaceSlotsView arena={arena} spaceId={spaceId} />}
    </OwnerArenaRouteShell>
  );
}
