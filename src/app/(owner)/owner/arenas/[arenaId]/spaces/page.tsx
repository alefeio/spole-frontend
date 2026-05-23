"use client";

import { use } from "react";
import { OwnerArenaSpacesView } from "@/features/owner-arenas/components/owner-arena-spaces-view";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";

type OwnerArenaSpacesPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function OwnerArenaSpacesPage({ params }: OwnerArenaSpacesPageProps) {
  const { arenaId } = use(params);
  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => <OwnerArenaSpacesView arena={arena} />}
    </OwnerArenaRouteShell>
  );
}
