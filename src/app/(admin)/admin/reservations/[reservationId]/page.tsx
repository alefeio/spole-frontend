"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/features/admin/components/admin-error-state";
import { AdminReservationDetailView } from "@/features/admin-reservations/components/admin-reservation-detail-view";
import { getReservationById } from "@/features/reservations/api";
import { isNotFoundError } from "@/lib/api/error-messages";

type AdminReservationDetailPageProps = {
  params: Promise<{ reservationId: string }>;
};

export default function AdminReservationDetailPage({ params }: AdminReservationDetailPageProps) {
  const { reservationId } = use(params);
  const query = useQuery({
    queryKey: ["admin", "reservation-detail", reservationId],
    queryFn: () => getReservationById(reservationId),
    enabled: Boolean(reservationId)
  });

  if (query.isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando reserva…</p>;
  }

  if (query.isError) {
    return (
      <div className="space-y-4">
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
        {isNotFoundError(query.error) ? (
          <Button asChild variant="ghost" className="min-h-11 px-0">
            <Link href="/admin/reservations">← Voltar para reservas</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  if (query.data) {
    return <AdminReservationDetailView reservation={query.data} />;
  }

  return null;
}
