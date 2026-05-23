"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
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
    return <p className="text-muted-foreground text-sm">Carregando arena…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
        {isNotFoundError(query.error) ? (
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href="/owner">← Painel da arena</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  if (query.data) {
    return <>{children(query.data)}</>;
  }

  return null;
}
