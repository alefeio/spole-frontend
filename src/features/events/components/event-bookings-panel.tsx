"use client";

import { useState } from "react";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/feedback/section-state";
import { Label } from "@/components/ui/label";
import { useEventBookings } from "@/features/events/hooks";
import type { EventBookingsListParams } from "@/features/events/types";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

const BOOKING_STATUS_LABELS: Record<string, string> = {
  RESERVED: "Reservado",
  COMPLETED: "Concluído",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado"
};

function bookingStatusLabel(status: string) {
  return BOOKING_STATUS_LABELS[status] ?? status;
}

type EventBookingsPanelProps = {
  eventId: string;
};

export function EventBookingsPanel({ eventId }: EventBookingsPanelProps) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EventBookingsListParams["status"]>(undefined);

  const query = useEventBookings(eventId, { page, limit: 10, status });

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Reservas/compras do evento</h2>
        <p className="text-muted-foreground text-sm">
          Reservas temporárias de vagas pagas — somente leitura.
        </p>
      </header>

      <div className="max-w-xs space-y-2">
        <Label htmlFor="booking-status-filter">Status</Label>
        <select
          id="booking-status-filter"
          className="border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm"
          value={status ?? ""}
          onChange={(e) => {
            setPage(1);
            setStatus((e.target.value || undefined) as EventBookingsListParams["status"]);
          }}
        >
          <option value="">Todos</option>
          <option value="RESERVED">Reservado</option>
          <option value="COMPLETED">Concluído</option>
          <option value="EXPIRED">Expirado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      {query.isLoading ? <CardsSkeleton count={3} /> : null}

      {query.isError ? (
        <ErrorState
          title="Erro ao carregar as reservas de vaga"
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isSuccess && query.data.data.length === 0 ? (
        <EmptyState
          title="Nenhuma reserva de vaga"
          description="Não há reservas de vaga para os filtros selecionados."
        />
      ) : null}

      {query.isSuccess && query.data.data.length > 0 ? (
        <div className="space-y-4">
          <ul className="divide-y rounded-lg border">
            {query.data.data.map((booking) => (
              <li key={booking.id} className="space-y-2 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{bookingStatusLabel(booking.status)}</span>
                  <span className="text-muted-foreground text-xs">
                    Reservado {formatDateTime(booking.reservedAt)}
                  </span>
                </div>
                <dl className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-xs">ID do booking</dt>
                    <dd className="font-mono text-xs break-all">{booking.id}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Participante</dt>
                    <dd className="font-mono text-xs break-all">{booking.userId}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Expira em</dt>
                    <dd>{formatDateTime(booking.expiresAt)}</dd>
                  </div>
                  {booking.purchaseCompletedAt ? (
                    <div>
                      <dt className="text-muted-foreground text-xs">Compra concluída</dt>
                      <dd>{formatDateTime(booking.purchaseCompletedAt)}</dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
          <PaginationControls
            page={query.data.meta.page}
            limit={query.data.meta.limit}
            total={query.data.meta.total}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </section>
  );
}
