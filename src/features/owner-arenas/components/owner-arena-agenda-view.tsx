"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AccessDenied } from "@/components/feedback/access-denied";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/feedback/section-state";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { OwnerDayDateControls } from "@/features/owner-arenas/components/owner-day-date-controls";
import { OwnerOperationalSummary } from "@/features/owner-arenas/components/owner-operational-summary";
import { OwnerReservationStatusBadge } from "@/features/owner-arenas/components/owner-reservation-status-badge";
import { getTodayDate } from "@/features/owner-arenas/utils/owner-date-presets";
import {
  filterReservationsByDate,
  sortReservationsBySlotStart,
  summarizeReservationsForDate
} from "@/features/owner-arenas/utils/owner-reservation-filters";
import { formatOwnerDateTime } from "@/features/owner/utils";
import { useOwnerArenaReservations } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";

const AGENDA_INFO_COPY =
  "Esta agenda mostra reservas recebidas na data selecionada. Horários disponíveis ficam na área de Horários.";

type OwnerArenaAgendaViewProps = {
  arena: Arena;
};

export function OwnerArenaAgendaView({ arena }: OwnerArenaAgendaViewProps) {
  const me = useMe();
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") ?? getTodayDate();
  const query = useOwnerArenaReservations(arena.id);
  const [dateValue, setDateValue] = useState(initialDate);
  const base = `/owner/arenas/${arena.id}`;

  const dayReservations = useMemo(() => {
    const list = filterReservationsByDate(query.data ?? [], dateValue);
    return sortReservationsBySlotStart(list);
  }, [query.data, dateValue]);

  const summary = useMemo(
    () => summarizeReservationsForDate(query.data ?? [], dateValue),
    [query.data, dateValue]
  );

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Agenda do dia"
        description="Reservas recebidas na data escolhida — filtro aplicado na lista carregada."
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <OwnerSectionCard>
        <p className="text-muted-foreground text-sm">{AGENDA_INFO_COPY}</p>
      </OwnerSectionCard>

      <OwnerDayDateControls
        id="agenda-date"
        value={dateValue}
        onChange={setDateValue}
        showDayNavigation
      />

      {query.isSuccess ? <OwnerOperationalSummary summary={summary} /> : null}

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
