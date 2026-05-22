import { CardsSkeleton } from "@/components/feedback/section-state";

export function ArenaDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-muted h-8 w-64 animate-pulse rounded" />
      <div className="bg-muted h-24 w-full animate-pulse rounded-xl" />
      <CardsSkeleton count={2} />
    </div>
  );
}
