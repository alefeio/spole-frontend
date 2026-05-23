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
import { OwnerClientFilterNotice } from "@/features/owner-arenas/components/owner-client-filter-notice";
import { OwnerDatePresets } from "@/features/owner-arenas/components/owner-date-presets";
import { OwnerReservationStatusBadge } from "@/features/owner-arenas/components/owner-reservation-status-badge";
import {
  filterReservationsByDate,
  filterReservationsByStatus,
  sortReservationsBySlotStart
} from "@/features/owner-arenas/utils/owner-reservation-filters";
import { formatOwnerDateTime } from "@/features/owner/utils";
import { useOwnerArenaReservations } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";

type OwnerArenaReservationsViewProps = {
  arena: Arena;
};

export function OwnerArenaReservationsView({ arena }: OwnerArenaReservationsViewProps) {
  const me = useMe();
  const query = useOwnerArenaReservations(arena.id);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const base = `/owner/arenas/${arena.id}`;

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    list = filterReservationsByStatus(list, statusFilter);
    list = filterReservationsByDate(list, dateFilter);
    return sortReservationsBySlotStart(list);
  }, [query.data, statusFilter, dateFilter]);

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  const emptyTitle = dateFilter
    ? "Nenhuma reserva recebida nesta data"
    : statusFilter
      ? "Nenhuma reserva com esse status"
      : "Nenhuma reserva recebida ainda";

  const agendaHref = dateFilter ? `${base}/agenda?date=${dateFilter}` : `${base}/agenda`;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Reservas recebidas"
        description="Todas as reservas da arena carregadas de uma vez pela API."
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <OwnerClientFilterNotice />

      <div className="space-y-4 rounded-xl border p-4">
        <div className="space-y-2">
          <Label htmlFor="res-date">Data do horário</Label>
          <input
            id="res-date"
            type="date"
            className={OWNER_INPUT_CLASS}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <OwnerDatePresets value={dateFilter} onChange={setDateFilter} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="res-status">Status</Label>
          <select
            id="res-status"
            className={OWNER_INPUT_CLASS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="CONSUMED">Consumida</option>
          </select>
        </div>
        {(dateFilter || statusFilter) && (
          <Button
            type="button"
            variant="ghost"
            className="min-h-11"
            onClick={() => {
              setDateFilter("");
              setStatusFilter("");
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {dateFilter ? (
        <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
          <Link href={agendaHref}>Ver agenda desta data</Link>
        </Button>
      ) : null}

      {query.isLoading ? <CardsSkeleton count={3} /> : null}
      {query.isError ? (
        <ErrorState
          title="Erro ao carregar reservas"
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isSuccess && filtered.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={
            dateFilter || statusFilter
              ? "Ajuste os filtros ou aguarde novas reservas."
              : "Quando um cliente reservar um horário, ela aparecerá aqui."
          }
        />
      ) : null}

      <ul className="space-y-3">
        {filtered.map((reservation) => (
          <li key={reservation.id}>
            <article className="space-y-3 rounded-xl border p-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <OwnerReservationStatusBadge status={reservation.status} />
                <span className="text-muted-foreground text-xs">{reservation.type}</span>
              </div>
              {reservation.slot ? (
                <p className="text-base font-semibold">
                  {formatOwnerDateTime(reservation.slot.startAt)} —{" "}
                  {formatOwnerDateTime(reservation.slot.endAt)}
                </p>
              ) : null}
              <dl className="grid gap-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Criada em</dt>
                  <dd>{formatOwnerDateTime(reservation.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Atualizada em</dt>
                  <dd>{formatOwnerDateTime(reservation.updatedAt)}</dd>
                </div>
              </dl>
              <p className="font-mono text-xs break-all">ID: {reservation.id}</p>
              <p className="font-mono text-xs break-all">Slot: {reservation.slotId}</p>
              <p className="font-mono text-xs break-all">Organizador: {reservation.organizerId}</p>
              <Button asChild variant="outline" className="min-h-11 w-full">
                <Link href={`${base}/reservations/${reservation.id}`}>Ver detalhe</Link>
              </Button>
            </article>
          </li>
        ))}
      </ul>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/agenda`}>Agenda do dia</Link>
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
