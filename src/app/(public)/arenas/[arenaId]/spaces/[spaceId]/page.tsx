"use client";

import { use } from "react";
import { ArenaDetailSkeleton } from "@/features/arenas/components/arena-detail-skeleton";
import { ArenaErrorState } from "@/features/arenas/components/arena-error-state";
import { useArena, useArenaSpaces } from "@/features/arenas/hooks";
import { SpaceSlotsBooking } from "@/features/spaces/components/space-slots-booking";
import { isNotFoundError } from "@/lib/api/error-messages";

type SpaceSlotsPageProps = {
  params: Promise<{ arenaId: string; spaceId: string }>;
};

export default function SpaceSlotsPage({ params }: SpaceSlotsPageProps) {
  const { arenaId, spaceId } = use(params);
  const arenaQuery = useArena(arenaId);
  const spacesQuery = useArenaSpaces(arenaId);
  const arena = arenaQuery.data;
  const bookingEnabled = arena?.status === "ACTIVE";

  if (arenaQuery.isLoading || spacesQuery.isLoading) {
    return <ArenaDetailSkeleton />;
  }

  if (arenaQuery.isError) {
    return (
      <ArenaErrorState
        error={arenaQuery.error}
        onRetry={isNotFoundError(arenaQuery.error) ? undefined : () => void arenaQuery.refetch()}
      />
    );
  }

  if (spacesQuery.isError) {
    return <ArenaErrorState error={spacesQuery.error} onRetry={() => void spacesQuery.refetch()} />;
  }

  const space = spacesQuery.data?.find((item) => item.id === spaceId);

  if (!space) {
    return (
      <div className="bg-muted/40 mx-auto max-w-xl space-y-2 rounded-xl border p-6 text-center">
        <h1 className="text-xl font-semibold">Espaço não encontrado</h1>
        <p className="text-muted-foreground text-sm">
          O espaço não pertence a esta arena ou não está publicado.
        </p>
      </div>
    );
  }

  return <SpaceSlotsBooking arenaId={arenaId} space={space} bookingEnabled={bookingEnabled} />;
}
