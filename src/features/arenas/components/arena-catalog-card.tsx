import Link from "next/link";
import type { PublicArenaListItem } from "@/features/arenas/types";

function formatLocation(arena: PublicArenaListItem) {
  const parts = [arena.district, arena.city, arena.state].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Localização não informada";
}

type ArenaCatalogCardProps = {
  arena: PublicArenaListItem;
};

export function ArenaCatalogCard({ arena }: ArenaCatalogCardProps) {
  return (
    <li className="bg-card hover:border-primary/30 flex flex-col gap-3 rounded-xl border p-5 shadow-xs transition-colors">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold break-words">
          <Link
            href={`/arenas/${arena.id}`}
            className="hover:text-primary focus-visible:outline-none"
          >
            {arena.name}
          </Link>
        </h2>
        <p className="text-muted-foreground text-sm">{formatLocation(arena)}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs">Reservar horário</span>
        <Link
          href={`/arenas/${arena.id}`}
          className="text-primary text-sm font-medium hover:underline"
        >
          Ver arena →
        </Link>
      </div>
    </li>
  );
}
