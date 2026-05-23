"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardsSkeleton, ErrorState } from "@/components/feedback/section-state";
import { useOwnerArena } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";
import { isNotFoundError } from "@/lib/api/error-messages";

type OwnerArenaRouteShellProps = {
  arenaId: string;
  children: (arena: Arena) => React.ReactNode;
};

export function OwnerArenaRouteShell({ arenaId, children }: OwnerArenaRouteShellProps) {
  const query = useOwnerArena(arenaId);

  if (query.isLoading) {
    return <CardsSkeleton count={2} />;
  }

  if (query.isError) {
    return (
      <div className="space-y-4 overflow-x-hidden">
        <ErrorState
          title={isNotFoundError(query.error) ? "Arena não encontrada" : "Erro ao carregar arena"}
          error={query.error}
          onRetry={() => void query.refetch()}
        />
        <Button asChild variant="ghost" className="min-h-11 px-0">
          <Link href="/owner/arenas">← Minhas arenas</Link>
        </Button>
      </div>
    );
  }

  if (query.data) {
    return <>{children(query.data)}</>;
  }

  return null;
}
