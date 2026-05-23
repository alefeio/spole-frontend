import Link from "next/link";
import { EmptyState } from "@/components/feedback/section-state";
import { Button } from "@/components/ui/button";

type OwnerArenasEmptyStateProps = {
  hasFilters: boolean;
  onClearFilters?: () => void;
};

export function OwnerArenasEmptyState({ hasFilters, onClearFilters }: OwnerArenasEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="Nenhuma arena com esses filtros"
          description="Tente outros termos ou limpe os filtros."
        />
        {onClearFilters ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <EmptyState
        title="Você ainda não tem arenas cadastradas"
        description="Crie sua primeira arena para começar a receber reservas."
      />
      <Button asChild className="min-h-11">
        <Link href="/owner/arenas/new">Criar primeira arena</Link>
      </Button>
    </div>
  );
}
