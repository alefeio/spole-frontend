import { Suspense } from "react";
import { ArenasCatalog } from "@/features/arenas/components/arenas-catalog";
import { ArenasSkeleton } from "@/features/arenas/components/arenas-skeleton";

export const metadata = {
  title: "Arenas"
};

export default function ArenasPage() {
  return (
    <Suspense fallback={<ArenasSkeleton />}>
      <ArenasCatalog />
    </Suspense>
  );
}
