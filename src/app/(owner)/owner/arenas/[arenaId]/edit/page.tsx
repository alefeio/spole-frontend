"use client";

import { use } from "react";
import { OwnerArenaEditForm } from "@/features/owner-arenas/components/owner-arena-edit-form";
import { OwnerArenaRouteShell } from "@/features/owner-arenas/components/owner-arena-route-shell";

type OwnerArenaEditPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function OwnerArenaEditPage({ params }: OwnerArenaEditPageProps) {
  const { arenaId } = use(params);
  return (
    <OwnerArenaRouteShell arenaId={arenaId}>
      {(arena) => <OwnerArenaEditForm arena={arena} />}
    </OwnerArenaRouteShell>
  );
}
