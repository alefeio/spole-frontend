"use client";

import { Suspense, use } from "react";
import { CardsSkeleton } from "@/components/feedback/section-state";
import { OwnerArenaAgendaView } from "@/features/owner-arenas/components/owner-arena-agenda-view";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";

type OwnerArenaAgendaPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function OwnerArenaAgendaPage({ params }: OwnerArenaAgendaPageProps) {
  const { arenaId } = use(params);
  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => (
        <Suspense fallback={<CardsSkeleton count={2} />}>
          <OwnerArenaAgendaView arena={arena} />
        </Suspense>
      )}
    </OwnerArenaRouteShell>
  );
}
