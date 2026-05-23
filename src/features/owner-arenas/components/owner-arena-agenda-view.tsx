"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AccessDenied } from "@/components/feedback/access-denied";
import { useMe } from "@/features/auth/hooks";
import { OwnerArenaNav } from "@/features/owner/components/owner-arena-nav";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import {
  formatOwnerDateTime,
  todayDateInputValue,
  isSameCalendarDay
} from "@/features/owner/utils";
import { useOwnerArenaReservations } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";
import type { ReservationListItem } from "@/features/reservations/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const inputClass = "border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 text-sm";

function sortByStart(a: ReservationListItem, b: ReservationListItem) {
  const ta = a.slot?.startAt ? new Date(a.slot.startAt).getTime() : 0;
  const tb = b.slot?.startAt ? new Date(b.slot.startAt).getTime() : 0;
  return ta - tb;
}

type OwnerArenaAgendaViewProps = {
  arena: Arena;
};

export function OwnerArenaAgendaView({ arena }: OwnerArenaAgendaViewProps) {
  const me = useMe();
  const query = useOwnerArenaReservations(arena.id);
  const [dateValue, setDateValue] = useState(todayDateInputValue);

  const dayReservations = useMemo(() => {
    const list = (query.data ?? []).filter(
      (r) => r.slot?.startAt && isSameCalendarDay(r.slot.startAt, dateValue)
    );
    return [...list].sort(sortByStart);
  }, [query.data, dateValue]);

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Agenda do dia"
        description="Esta agenda mostra as reservas recebidas na data selecionada (filtro no navegador)."
        actions={<OwnerArenaNav arenaId={arena.id} />}
      />

      <div className="space-y-2">
        <Label htmlFor="agenda-date">Data</Label>
        <input
          id="agenda-date"
          type="date"
          className={inputClass}
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
        />
      </div>

      {query.isLoading ? <p className="text-muted-foreground text-sm">Carregando…</p> : null}
      {query.isError ? (
        <p className="text-destructive text-sm">{getApiErrorMessage(query.error)}</p>
      ) : null}

      {query.isSuccess && dayReservations.length === 0 ? (
        <OwnerSectionCard>
          <p className="text-muted-foreground text-sm">Nenhuma reserva neste dia.</p>
        </OwnerSectionCard>
      ) : null}

      <ol className="space-y-3">
        {dayReservations.map((reservation) => (
          <li key={reservation.id}>
            <article className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium">
                  {reservation.slot
                    ? `${formatOwnerDateTime(reservation.slot.startAt)} — ${formatOwnerDateTime(reservation.slot.endAt)}`
                    : "Horário não informado"}
                </p>
                <Badge variant="outline">{reservation.status}</Badge>
              </div>
              <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                <Link href={`/owner/arenas/${arena.id}/reservations/${reservation.id}`}>
                  Detalhe
                </Link>
              </Button>
            </article>
          </li>
        ))}
      </ol>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={`/owner/arenas/${arena.id}`}>← Arena</Link>
      </Button>
    </div>
  );
}
