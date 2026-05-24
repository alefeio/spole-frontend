"use client";

import { useState } from "react";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/feedback/section-state";
import { Label } from "@/components/ui/label";
import { useEventPayments } from "@/features/events/hooks";
import type { EventPaymentsListParams } from "@/features/events/types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

type EventPaymentsPanelProps = {
  eventId: string;
};

export function EventPaymentsPanel({ eventId }: EventPaymentsPanelProps) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EventPaymentsListParams["status"]>(undefined);

  const query = useEventPayments(eventId, { page, limit: 10, status });

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Pagamentos do evento</h2>
        <p className="text-muted-foreground text-sm">
          Pagamentos vinculados a bookings — somente leitura.
        </p>
      </header>

      <div className="max-w-xs space-y-2">
        <Label htmlFor="payment-status-filter">Status</Label>
        <select
          id="payment-status-filter"
          className="border-input bg-background min-h-11 w-full rounded-md border px-3 text-sm"
          value={status ?? ""}
          onChange={(e) => {
            setPage(1);
            setStatus((e.target.value || undefined) as EventPaymentsListParams["status"]);
          }}
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendente</option>
          <option value="PAID">Pago</option>
          <option value="FAILED">Falhou</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      {query.isLoading ? <CardsSkeleton count={3} /> : null}

      {query.isError ? (
        <ErrorState
          title="Erro ao carregar pagamentos"
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isSuccess && query.data.data.length === 0 ? (
        <EmptyState
          title="Nenhum pagamento"
          description="Não há pagamentos para os filtros selecionados."
        />
      ) : null}

      {query.isSuccess && query.data.data.length > 0 ? (
        <div className="space-y-4">
          <ul className="divide-y rounded-lg border">
            {query.data.data.map((payment) => (
              <li key={payment.id} className="space-y-2 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{payment.status}</span>
                  <span className="font-semibold">{formatMoney(payment.grossAmount)}</span>
                </div>
                <dl className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-xs">ID do pagamento</dt>
                    <dd className="font-mono text-xs break-all">{payment.id}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Booking</dt>
                    <dd className="font-mono text-xs break-all">{payment.bookingId}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Método</dt>
                    <dd>
                      {payment.method} · {payment.provider}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">Pago em</dt>
                    <dd>{formatDateTime(payment.paidAt)}</dd>
                  </div>
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
