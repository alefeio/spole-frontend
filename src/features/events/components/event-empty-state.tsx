type EventEmptyStateProps = {
  hasFilters?: boolean;
};

export function EventEmptyState({ hasFilters }: EventEmptyStateProps) {
  return (
    <div className="bg-muted/40 rounded-xl border p-8 text-center">
      <h2 className="text-lg font-semibold">Nenhum evento encontrado</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        {hasFilters
          ? "Tente remover filtros ou buscar por outro termo."
          : "Ainda não há eventos públicos publicados no catálogo."}
      </p>
    </div>
  );
}
