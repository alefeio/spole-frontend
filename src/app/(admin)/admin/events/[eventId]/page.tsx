"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
import { AdminEventDetailView } from "@/features/admin-events/components/admin-event-detail-view";
import { useEvent } from "@/features/events/hooks";
import { isNotFoundError } from "@/lib/api/error-messages";

type AdminEventDetailPageProps = {
  params: Promise<{ eventId: string }>;
};

export default function AdminEventDetailPage({ params }: AdminEventDetailPageProps) {
  const { eventId } = use(params);
  const query = useEvent(eventId);

  if (query.isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando evento…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
        {isNotFoundError(query.error) ? (
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href="/admin/events">← Voltar para eventos</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  if (query.data) {
    return <AdminEventDetailView event={query.data} />;
  }

  return null;
}
