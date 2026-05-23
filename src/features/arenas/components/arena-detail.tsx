import type { Arena } from "@/features/arenas/types";

type ArenaDetailProps = {
  arena: Arena;
};

function formatAddress(arena: Arena) {
  const parts = [
    arena.address.street,
    arena.address.number,
    arena.address.district,
    arena.address.city,
    arena.address.state
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Endereço não informado";
}

export function ArenaDetail({ arena }: ArenaDetailProps) {
  const isActive = arena.status === "ACTIVE";

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight break-words sm:text-3xl">
            {arena.name}
          </h1>
          {arena.description ? (
            <p className="text-muted-foreground mt-2 text-sm break-words">{arena.description}</p>
          ) : null}
        </div>
        <span className="bg-secondary text-secondary-foreground w-fit rounded-full px-3 py-1 text-sm font-medium">
          {isActive ? "Arena ativa" : arena.status}
        </span>
      </div>

      {!isActive ? (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-3 text-sm">
          Esta arena não está ativa. Reservas de horário não estão disponíveis no momento.
        </p>
      ) : null}

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Endereço</dt>
          <dd className="font-medium break-words">{formatAddress(arena)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Telefone</dt>
          <dd className="font-medium">{arena.phone}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Antecedência mínima</dt>
          <dd className="font-medium">{arena.policy.minAdvanceHours} h</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Pagamento mínimo da reserva</dt>
          <dd className="font-medium">{arena.policy.minReservationPaymentPercent}%</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Recorrência na política</dt>
          <dd className="font-medium">
            {arena.policy.allowRecurring ? "Permitida pela arena" : "Não permitida"}
          </dd>
        </div>
      </dl>

      <p className="text-muted-foreground bg-muted/40 rounded-lg border p-3 text-sm">
        Você pode reservar horários avulsos (SINGLE) quando a arena estiver ativa. O pagamento
        mínimo da reserva ({arena.policy.minReservationPaymentPercent}%) define se será necessário
        concluir um pagamento simulado após a reserva ou se ela pode ser confirmada na criação. A
        recorrência semanal ainda não está disponível nesta interface.
      </p>
    </section>
  );
}
