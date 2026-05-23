import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";

type OwnerArenaNavProps = {
  arenaId: string;
};

/** @deprecated Prefer OwnerArenaNavigation — mantido como alias. */
export function OwnerArenaNav({ arenaId }: OwnerArenaNavProps) {
  return <OwnerArenaNavigation arenaId={arenaId} />;
}
