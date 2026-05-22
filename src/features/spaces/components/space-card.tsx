import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ArenaSpace } from "@/features/arenas/types";

type SpaceCardProps = {
  space: ArenaSpace;
  arenaId: string;
  bookingEnabled: boolean;
};

export function SpaceCard({ space, arenaId, bookingEnabled }: SpaceCardProps) {
  const isActive = space.status === "ACTIVE";

  return (
    <article className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold break-words">{space.name}</h3>
          <p className="text-muted-foreground text-sm">{space.type}</p>
        </div>
        <span className="bg-secondary text-secondary-foreground w-fit rounded-full px-2.5 py-1 text-xs font-medium">
          {isActive ? "Ativo" : space.status}
        </span>
      </div>

      {space.description ? (
        <p className="text-muted-foreground text-sm break-words">{space.description}</p>
      ) : null}

      {space.capacitySuggestion != null ? (
        <p className="text-sm">
          <span className="text-muted-foreground">Capacidade sugerida: </span>
          <span className="font-medium">{space.capacitySuggestion}</span>
        </p>
      ) : null}

      {bookingEnabled && isActive ? (
        <Button asChild className="min-h-11 w-full sm:min-h-9 sm:w-auto">
          <Link href={`/arenas/${arenaId}/spaces/${space.id}`}>Ver horários</Link>
        </Button>
      ) : (
        <p className="text-muted-foreground text-sm">
          {!isActive
            ? "Este espaço não está disponível para reserva."
            : "Reservas indisponíveis enquanto a arena não estiver ativa."}
        </p>
      )}
    </article>
  );
}
