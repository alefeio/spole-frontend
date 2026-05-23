"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AccessDenied } from "@/components/feedback/access-denied";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/feedback/section-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMe } from "@/features/auth/hooks";
import { OWNER_INPUT_CLASS } from "@/features/owner/components/owner-constants";
import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerReservationStatusBadge } from "@/features/owner-arenas/components/owner-reservation-status-badge";
import {
  formatOwnerDateTime,
  isSameCalendarDay,
  sortReservationsBySlotStart,
  todayDateInputValue
} from "@/features/owner/utils";
import { useOwnerArenaReservations } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";

type OwnerArenaAgendaViewProps = {
  arena: Arena;
};

export function OwnerArenaAgendaView({ arena }: OwnerArenaAgendaViewProps) {
  const me = useMe();
  const query = useOwnerArenaReservations(arena.id);
  const [dateValue, setDateValue] = useState(todayDateInputValue);
  const base = `/owner/arenas/${arena.id}`;

  const dayReservations = useMemo(() => {
    const list = (query.data ?? []).filter(
      (r) => r.slot?.startAt && isSameCalendarDay(r.slot.startAt, dateValue)
    );
    return sortReservationsBySlotStart(list);
  }, [query.data, dateValue]);

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Agenda do dia"
        description="Reservas recebidas ordenadas por horário — filtro por data no navegador."
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <div className="space-y-2">
        <Label htmlFor="agenda-date">Data</Label>
        <input
          id="agenda-date"
          type="date"
          className={OWNER_INPUT_CLASS}
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
        />
      </div>

      {query.isLoading ? <CardsSkeleton count={2} /> : null}
      {query.isError ? (
        <ErrorState
          title="Erro ao carregar agenda"
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isSuccess && dayReservations.length === 0 ? (
        <EmptyState
          title="Nenhuma reserva para esta data"
          description="Escolha outra data ou cadastre horários disponíveis nos espaços."
        />
      ) : null}

      <ol className="space-y-3">
        {dayReservations.map((reservation) => (
          <li key={reservation.id}>
            <article className="flex flex-col gap-3 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-2">
                <p className="font-semibold">
                  {reservation.slot
                    ? `${formatOwnerDateTime(reservation.slot.startAt)} — ${formatOwnerDateTime(reservation.slot.endAt)}`
                    : "Horário não informado"}
                </p>
                <OwnerReservationStatusBadge status={reservation.status} />
                <p className="text-muted-foreground font-mono text-xs break-all">
                  {reservation.id}
                </p>
              </div>
              <Button asChild variant="outline" className="min-h-11 w-full shrink-0 sm:w-auto">
                <Link href={`${base}/reservations/${reservation.id}`}>Ver detalhe</Link>
              </Button>
            </article>
          </li>
        ))}
      </ol>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/reservations`}>Ver todas as reservas</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/spaces`}>Espaços e horários</Link>
        </Button>
      </div>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={base}>← Visão geral da arena</Link>
      </Button>
    </div>
  );
}
