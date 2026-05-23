import type { OwnerReservationDaySummary } from "@/features/owner-arenas/utils/owner-reservation-filters";

type OwnerOperationalSummaryProps = {
  summary: OwnerReservationDaySummary;
  dateLabel?: string;
};

export function OwnerOperationalSummary({ summary, dateLabel }: OwnerOperationalSummaryProps) {
  return (
    <section className="rounded-xl border p-4">
      <h2 className="text-sm font-semibold">Resumo do dia{dateLabel ? ` (${dateLabel})` : ""}</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Com base na lista de reservas já carregada — não é um relatório financeiro.
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Total</dt>
          <dd className="text-lg font-semibold">{summary.total}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Pendentes</dt>
          <dd className="text-lg font-semibold">{summary.pending}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Confirmadas</dt>
          <dd className="text-lg font-semibold">{summary.confirmed}</dd>
        </div>
      </dl>
    </section>
  );
}
