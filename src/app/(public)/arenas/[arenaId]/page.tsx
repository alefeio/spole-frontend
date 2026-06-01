"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { ArenaDetail } from "@/features/arenas/components/arena-detail";
import { ArenaDetailSkeleton } from "@/features/arenas/components/arena-detail-skeleton";
import { ArenaErrorState } from "@/features/arenas/components/arena-error-state";
import { ArenaSpacesList } from "@/features/arenas/components/arena-spaces-list";
import { useArena, useArenaSpaces } from "@/features/arenas/hooks";
import { isNotFoundError } from "@/lib/api/error-messages";

type ArenaDetailPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function ArenaDetailPage({ params }: ArenaDetailPageProps) {
  const { arenaId } = use(params);
  const arenaQuery = useArena(arenaId);
  const spacesQuery = useArenaSpaces(arenaId);
  const arena = arenaQuery.data;
  const bookingEnabled = arena?.status === "ACTIVE";

  if (arenaQuery.isLoading) {
    return (
      <div className="space-y-6">
        <ArenaNavBack />
        <ArenaDetailSkeleton />
      </div>
    );
  }

  if (arenaQuery.isError) {
    return (
      <div className="space-y-6">
        <ArenaNavBack />
        <ArenaErrorState
          error={arenaQuery.error}
          onRetry={isNotFoundError(arenaQuery.error) ? undefined : () => void arenaQuery.refetch()}
        />
        {isNotFoundError(arenaQuery.error) ? (
          <p className="text-muted-foreground text-center text-sm">Arena não encontrada.</p>
        ) : null}
      </div>
    );
  }

  if (!arena) return null;

  return (
    <div className="space-y-8">
      <ArenaNavBack />
      <ArenaDetail arena={arena} />
      {spacesQuery.isLoading ? <ArenaDetailSkeleton /> : null}
      {spacesQuery.isError ? (
        <ArenaErrorState error={spacesQuery.error} onRetry={() => void spacesQuery.refetch()} />
      ) : null}
      {spacesQuery.isSuccess ? (
        <ArenaSpacesList
          spaces={spacesQuery.data}
          arenaId={arenaId}
          bookingEnabled={bookingEnabled}
        />
      ) : null}
    </div>
  );
}

function ArenaNavBack() {
  return (
    <Button asChild variant="ghost" className="min-h-11 px-0 sm:min-h-9">
      <Link href="/arenas">← Arenas</Link>
    </Button>
  );
}
