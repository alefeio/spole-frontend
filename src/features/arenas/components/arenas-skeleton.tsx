export function ArenasSkeleton() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="bg-card animate-pulse rounded-xl border p-5">
          <div className="bg-muted mb-3 h-5 w-3/4 rounded" />
          <div className="bg-muted mb-2 h-4 w-1/2 rounded" />
          <div className="bg-muted h-3 w-full rounded" />
        </li>
      ))}
    </ul>
  );
}
