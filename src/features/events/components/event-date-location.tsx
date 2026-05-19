import type { EventDetails } from "@/features/events/types";

type EventDateLocationProps = {
  event: EventDetails;
};

function formatDateRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (Number.isNaN(start.getTime())) return "Data a confirmar";

  const date = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(start);

  const startTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(start);

  if (Number.isNaN(end.getTime())) return `${date}, às ${startTime}`;

  const endTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(end);

  return `${date}, das ${startTime} às ${endTime}`;
}

export function EventDateLocation({ event }: EventDateLocationProps) {
  return (
    <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
      <div>
        <p className="text-muted-foreground text-sm">Data e horário</p>
        <p className="font-medium">{formatDateRange(event.startAt, event.endAt)}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">Local</p>
        <p className="font-medium">
          {[event.addressName, event.city, event.state].filter(Boolean).join(" · ") ||
            "Local a confirmar"}
        </p>
      </div>
    </div>
  );
}
