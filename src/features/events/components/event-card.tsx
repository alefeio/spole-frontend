import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/features/events/types";

type EventCardProps = {
  event: Event;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data a confirmar";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatPrice(event: Event) {
  if (event.type === "FREE") return "Gratuito";
  if (typeof event.pricePerPerson !== "number") return "Valor a confirmar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(event.pricePerPerson);
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="bg-card text-card-foreground flex h-full flex-col rounded-xl border p-4 shadow-xs">
      <div className="flex flex-1 flex-col gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={event.type === "FREE" ? "success" : "accent"}>
              {event.type === "FREE" ? "Gratuito" : "Pago"}
            </Badge>
            <span className="text-muted-foreground text-xs">{formatDate(event.startAt)}</span>
          </div>
          <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">{event.title}</h2>
        </div>

        <dl className="text-muted-foreground grid gap-1 text-sm">
          <div className="flex justify-between gap-3">
            <dt>Local</dt>
            <dd className="text-foreground text-right font-medium">
              {[event.city, event.state].filter(Boolean).join(", ") || "A confirmar"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Capacidade</dt>
            <dd className="text-foreground font-medium">{event.capacity}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Valor</dt>
            <dd className="text-foreground font-medium">{formatPrice(event)}</dd>
          </div>
        </dl>
      </div>

      <Button asChild className="mt-5 w-full" variant="outline">
        <Link href={`/events/${event.id}`}>Ver detalhes</Link>
      </Button>
    </article>
  );
}
