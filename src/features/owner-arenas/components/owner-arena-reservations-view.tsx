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
import { formatOwnerDateTime, isSameCalendarDay } from "@/features/owner/utils";
import { useOwnerArenaReservations } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const inputClass = "border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 text-sm";

type OwnerArenaReservationsViewProps = {
  arena: Arena;
};

export function OwnerArenaReservationsView({ arena }: OwnerArenaReservationsViewProps) {
  const me = useMe();
  const query = useOwnerArenaReservations(arena.id);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    if (dateFilter) {
      list = list.filter((r) => r.slot?.startAt && isSameCalendarDay(r.slot.startAt, dateFilter));
    }
    return list;
  }, [query.data, statusFilter, dateFilter]);

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Reservas recebidas"
        description="Reservas de clientes na sua arena. Filtros aplicados no navegador — a API não pagina esta rota."
        actions={<OwnerArenaNav arenaId={arena.id} />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="res-date">Data do horário (filtro local)</Label>
          <input
            id="res-date"
            type="date"
            className={inputClass}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="res-status">Status</Label>
          <select
            id="res-status"
            className={inputClass}
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
      </div>

      {query.isLoading ? <p className="text-muted-foreground text-sm">Carregando…</p> : null}
      {query.isError ? (
        <p className="text-destructive text-sm">{getApiErrorMessage(query.error)}</p>
      ) : null}

      {query.isSuccess && filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhuma reserva encontrada.</p>
      ) : null}

      <ul className="space-y-3">
        {filtered.map((reservation) => (
          <li key={reservation.id}>
            <article className="space-y-3 rounded-xl border p-4">
              <Badge variant="outline">{reservation.status}</Badge>
              <p className="text-muted-foreground text-xs">{reservation.type}</p>
              {reservation.slot ? (
                <p className="text-sm">
                  {formatOwnerDateTime(reservation.slot.startAt)} —{" "}
                  {formatOwnerDateTime(reservation.slot.endAt)}
                </p>
              ) : null}
              <p className="font-mono text-xs break-all">Organizador: {reservation.organizerId}</p>
              <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                <Link href={`/owner/arenas/${arena.id}/reservations/${reservation.id}`}>
                  Ver detalhe
                </Link>
              </Button>
            </article>
          </li>
        ))}
      </ul>

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={`/owner/arenas/${arena.id}`}>← Arena</Link>
      </Button>
    </div>
  );
}
