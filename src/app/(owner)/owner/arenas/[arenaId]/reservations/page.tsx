"use client";

import { use } from "react";
import { OwnerArenaReservationsView } from "@/features/owner-arenas/components/owner-arena-reservations-view";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";

type OwnerArenaReservationsPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function OwnerArenaReservationsPage({ params }: OwnerArenaReservationsPageProps) {
  const { arenaId } = use(params);
  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => <OwnerArenaReservationsView arena={arena} />}
    </OwnerArenaRouteShell>
  );
}
