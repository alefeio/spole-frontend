import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReservationStatusBadge } from "@/features/reservations/components/reservation-status-badge";
import type { ReservationListItem } from "@/features/reservations/types";

function formatSlotWindow(slot?: { startAt: string; endAt: string }) {
  if (!slot) return "Horário não informado";
  const start = new Date(slot.startAt);
  const end = new Date(slot.endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Horário inválido";
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function ReservationCard({ reservation }: { reservation: ReservationListItem }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Reserva de arena</p>
          <p className="font-mono text-xs break-all">{reservation.id}</p>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Horário</dt>
          <dd className="font-medium">{formatSlotWindow(reservation.slot)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Tipo</dt>
          <dd className="font-medium">{reservation.type}</dd>
        </div>
      </dl>

      <Button asChild className="min-h-11 w-full sm:min-h-9 sm:w-auto">
        <Link href={`/account/reservations/${reservation.id}`}>Ver detalhes</Link>
      </Button>
    </article>
  );
}
