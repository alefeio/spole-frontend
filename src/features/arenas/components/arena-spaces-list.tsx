import { SpaceCard } from "@/features/spaces/components/space-card";
import { SpacesEmptyState } from "@/features/spaces/components/spaces-empty-state";
import type { ArenaSpace } from "@/features/arenas/types";

type ArenaSpacesListProps = {
  spaces: ArenaSpace[];
  arenaId: string;
  bookingEnabled: boolean;
};

export function ArenaSpacesList({ spaces, arenaId, bookingEnabled }: ArenaSpacesListProps) {
  const activeSpaces = spaces.filter((s) => s.status === "ACTIVE");
  const inactiveSpaces = spaces.filter((s) => s.status !== "ACTIVE");
  const displaySpaces = [...activeSpaces, ...inactiveSpaces];

  if (displaySpaces.length === 0) {
    return <SpacesEmptyState />;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Espaços</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {displaySpaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            arenaId={arenaId}
            bookingEnabled={bookingEnabled}
          />
        ))}
      </div>
    </section>
  );
}
