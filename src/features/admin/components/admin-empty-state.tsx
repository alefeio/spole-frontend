import { Button } from "@/components/ui/button";

type AdminEmptyStateProps = {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
};

export function AdminEmptyState({
  title = "Nenhum registro encontrado",
  description = "Ajuste os filtros ou aguarde novos dados na API.",
  onClearFilters
}: AdminEmptyStateProps) {
  return (
    <div className="space-y-3 rounded-xl border border-dashed p-6 text-center">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
      {onClearFilters ? (
        <Button type="button" variant="outline" className="min-h-11" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
}
