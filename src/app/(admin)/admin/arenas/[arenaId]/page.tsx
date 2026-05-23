"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
import { AdminArenaDetailView } from "@/features/admin-arenas/components/admin-arena-detail-view";
import { getArenaById } from "@/features/arenas/api";
import { isNotFoundError } from "@/lib/api/error-messages";

type AdminArenaDetailPageProps = {
  params: Promise<{ arenaId: string }>;
};

export default function AdminArenaDetailPage({ params }: AdminArenaDetailPageProps) {
  const { arenaId } = use(params);
  const query = useQuery({
    queryKey: ["admin", "arena-detail", arenaId],
    queryFn: () => getArenaById(arenaId),
    enabled: Boolean(arenaId)
  });

  if (query.isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando arena…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
        {isNotFoundError(query.error) ? (
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href="/admin/arenas">← Voltar para arenas</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  if (query.data) {
    return <AdminArenaDetailView arena={query.data} />;
  }

  return null;
}
