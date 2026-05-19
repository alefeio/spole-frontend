export function EventListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Carregando eventos">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border p-4">
          <div className="bg-muted mb-4 h-5 w-28 animate-pulse rounded-full" />
          <div className="bg-muted mb-3 h-6 w-4/5 animate-pulse rounded" />
          <div className="space-y-2">
            <div className="bg-muted h-4 w-full animate-pulse rounded" />
            <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
          </div>
          <div className="bg-muted mt-5 h-9 w-full animate-pulse rounded-md" />
        </div>
      ))}
    </div>
  );
}
