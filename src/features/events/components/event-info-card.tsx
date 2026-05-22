import type { EventDetails } from "@/features/events/types";

type EventInfoCardProps = {
  event: EventDetails;
};

const TYPE_LABELS: Record<EventDetails["type"], string> = {
  FREE: "Gratuito",
  PAID: "Pago"
};

const VISIBILITY_LABELS: Record<EventDetails["visibility"], string> = {
  PUBLIC: "Público",
  PRIVATE: "Privado"
};

const STATUS_LABELS: Record<EventDetails["status"], string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  CANCELLED: "Cancelado"
};

const SOURCE_LABELS: Record<EventDetails["sourceType"], string> = {
  FREE_LOCATION: "Local livre",
  ARENA_RESERVATION: "Reserva de arena"
};

export function EventInfoCard({ event }: EventInfoCardProps) {
  return (
    <aside className="space-y-4 rounded-xl border p-4">
      <h2 className="font-semibold">Informações</h2>
      <dl className="grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Tipo</dt>
          <dd className="font-medium">{TYPE_LABELS[event.type]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Visibilidade</dt>
          <dd className="font-medium">{VISIBILITY_LABELS[event.visibility]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium">{STATUS_LABELS[event.status] ?? event.status}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Origem</dt>
          <dd className="font-medium">{SOURCE_LABELS[event.sourceType] ?? event.sourceType}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Capacidade</dt>
          <dd className="font-medium">{event.capacity}</dd>
        </div>
      </dl>
    </aside>
  );
}
