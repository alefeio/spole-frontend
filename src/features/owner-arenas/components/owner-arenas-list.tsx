import { OwnerArenaCard } from "@/features/owner-arenas/components/owner-arena-card";
import type { OwnerArenaListItem } from "@/features/owner-arenas/types";

type OwnerArenasListProps = {
  arenas: OwnerArenaListItem[];
};

export function OwnerArenasList({ arenas }: OwnerArenasListProps) {
  return (
    <ul className="space-y-3">
      {arenas.map((arena) => (
        <li key={arena.id}>
          <OwnerArenaCard arena={arena} />
        </li>
      ))}
    </ul>
  );
}
