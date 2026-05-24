type ArenasEmptyStateProps = {
  hasFilters: boolean;
};

export function ArenasEmptyState({ hasFilters }: ArenasEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <p className="font-medium">
        {hasFilters ? "Nenhuma arena encontrada com esses filtros." : "Nenhuma arena disponível."}
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        {hasFilters
          ? "Tente outro termo de busca ou limpe os filtros."
          : "Volte em breve ou explore eventos na plataforma."}
      </p>
    </div>
  );
}
