export function OrganizerEventsSkeleton() {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="bg-muted/40 h-48 animate-pulse rounded-xl border" aria-hidden />
      ))}
    </ul>
  );
}
