import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OwnerArenaStatusBadge } from "@/features/owner-arenas/components/owner-arena-status-badge";
import type { OwnerArenaListItem } from "@/features/owner-arenas/types";
import { formatOwnerDateTime } from "@/features/owner/utils";

type OwnerArenaCardProps = {
  arena: OwnerArenaListItem;
};

export function OwnerArenaCard({ arena }: OwnerArenaCardProps) {
  const base = `/owner/arenas/${arena.id}`;
  const location =
    arena.city && arena.state
      ? `${arena.city} / ${arena.state}`
      : (arena.city ?? arena.state ?? "Local não informado");

  return (
    <article className="space-y-4 rounded-xl border p-4 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-lg font-semibold break-words">{arena.name}</h2>
          <p className="text-muted-foreground text-sm">{location}</p>
          {arena.slug ? (
            <p className="text-muted-foreground font-mono text-xs break-all">{arena.slug}</p>
          ) : null}
        </div>
        <OwnerArenaStatusBadge status={arena.status} />
      </div>

      <dl className="grid gap-2 border-t pt-3 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Criada em</dt>
          <dd className="font-medium">{formatOwnerDateTime(arena.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Atualizada em</dt>
          <dd className="font-medium">{formatOwnerDateTime(arena.updatedAt)}</dd>
        </div>
      </dl>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button asChild className="min-h-11 sm:col-span-2">
          <Link href={base}>Ver detalhes</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/spaces`}>Espaços</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/reservations`}>Reservas</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 sm:col-span-2">
          <Link href={`${base}/agenda`}>Agenda</Link>
        </Button>
      </div>
    </article>
  );
}
