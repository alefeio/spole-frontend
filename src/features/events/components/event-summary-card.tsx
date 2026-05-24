"use client";

import { CardsSkeleton, ErrorState } from "@/components/feedback/section-state";
import { useEventSummary } from "@/features/events/hooks";
import type { EventType } from "@/features/events/types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

type EventSummaryCardProps = {
  eventId: string;
  eventType: EventType;
};

export function EventSummaryCard({ eventId, eventType }: EventSummaryCardProps) {
  const summaryQuery = useEventSummary(eventId);

  if (summaryQuery.isLoading) {
    return <CardsSkeleton count={4} />;
  }

  if (summaryQuery.isError) {
    return (
      <ErrorState
        title="Resumo indisponível"
        error={summaryQuery.error}
        onRetry={() => void summaryQuery.refetch()}
      />
    );
  }

  const s = summaryQuery.data;
  if (!s) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Resumo operacional</h2>
        <p className="text-muted-foreground text-sm">
          Dados retornados pela API — não calculados no navegador.
        </p>
      </header>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-3">
          <dt className="text-muted-foreground">Capacidade</dt>
          <dd className="text-lg font-semibold">{s.capacity}</dd>
        </div>
        <div className="rounded-lg border p-3">
          <dt className="text-muted-foreground">Vagas restantes</dt>
          <dd className="text-lg font-semibold">{s.remainingSpots}</dd>
        </div>
        <div className="rounded-lg border p-3">
          <dt className="text-muted-foreground">Inscritos confirmados</dt>
          <dd className="text-lg font-semibold">{s.confirmedParticipants}</dd>
        </div>
        {eventType === "PAID" ? (
          <>
            <div className="rounded-lg border p-3">
              <dt className="text-muted-foreground">Bookings ativos</dt>
              <dd className="text-lg font-semibold">{s.activeBookings}</dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-muted-foreground">Bookings concluídos</dt>
              <dd className="text-lg font-semibold">{s.completedBookings}</dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-muted-foreground">Pagamentos pagos</dt>
              <dd className="text-lg font-semibold">{s.paidPaymentsCount}</dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-muted-foreground">Pagamentos pendentes</dt>
              <dd className="text-lg font-semibold">{s.pendingPaymentsCount}</dd>
            </div>
            <div className="rounded-lg border p-3 sm:col-span-2">
              <dt className="text-muted-foreground">Receita bruta (pagos)</dt>
              <dd className="text-lg font-semibold">{formatMoney(s.grossRevenue)}</dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-muted-foreground">Receita líquida (pagos)</dt>
              <dd className="text-lg font-semibold">{formatMoney(s.netRevenue)}</dd>
            </div>
          </>
        ) : null}
      </dl>

      {eventType === "FREE" ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-3 text-sm">
          Eventos gratuitos podem não gerar bookings ou pagamentos. Use a lista de participantes
          abaixo para acompanhar inscrições.
        </p>
      ) : null}
    </section>
  );
}
