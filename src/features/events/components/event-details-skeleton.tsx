export function EventDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-label="Carregando detalhe do evento">
      <div className="space-y-3">
        <div className="bg-muted h-5 w-28 animate-pulse rounded-full" />
        <div className="bg-muted h-10 w-4/5 animate-pulse rounded" />
        <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="bg-muted h-28 animate-pulse rounded-xl" />
          <div className="bg-muted h-48 animate-pulse rounded-xl" />
        </div>
        <div className="bg-muted h-64 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
