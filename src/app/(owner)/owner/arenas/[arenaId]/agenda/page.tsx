"use client";

import { use } from "react";
import { OwnerArenaAgendaView } from "@/features/owner-arenas/components/owner-arena-agenda-view";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";

type OwnerArenaAgendaPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function OwnerArenaAgendaPage({ params }: OwnerArenaAgendaPageProps) {
  const { arenaId } = use(params);
  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => <OwnerArenaAgendaView arena={arena} />}
    </OwnerArenaRouteShell>
  );
}
