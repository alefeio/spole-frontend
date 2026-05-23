export function OwnerArenasSkeleton() {
  return (
    <ul className="space-y-3">
      {[1, 2, 3].map((i) => (
        <li key={i} className="bg-muted/40 h-40 animate-pulse rounded-xl border" />
      ))}
    </ul>
  );
}
