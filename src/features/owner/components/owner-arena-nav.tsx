import Link from "next/link";
import { Button } from "@/components/ui/button";

type OwnerArenaNavProps = {
  arenaId: string;
};

export function OwnerArenaNav({ arenaId }: OwnerArenaNavProps) {
  const base = `/owner/arenas/${arenaId}`;
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Arena">
      <Button asChild variant="outline" size="sm" className="min-h-11 sm:min-h-9">
        <Link href={`${base}/edit`}>Editar</Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="min-h-11 sm:min-h-9">
        <Link href={`${base}/spaces`}>Espaços</Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="min-h-11 sm:min-h-9">
        <Link href={`${base}/reservations`}>Reservas</Link>
      </Button>
      <Button asChild variant="outline" size="sm" className="min-h-11 sm:min-h-9">
        <Link href={`${base}/agenda`}>Agenda</Link>
      </Button>
    </nav>
  );
}
