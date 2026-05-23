import Link from "next/link";
import { Button } from "@/components/ui/button";

type OwnerArenasEmptyStateProps = {
  hasFilters: boolean;
  onClearFilters?: () => void;
};

export function OwnerArenasEmptyState({ hasFilters, onClearFilters }: OwnerArenasEmptyStateProps) {
  return (
    <section className="space-y-4 rounded-xl border border-dashed p-6 text-center">
      <h2 className="text-lg font-semibold">
        {hasFilters ? "Nenhuma arena com esses filtros" : "Você ainda não tem arenas cadastradas"}
      </h2>
      <p className="text-muted-foreground text-sm">
        {hasFilters
          ? "Tente outros filtros ou limpe a busca."
          : "Crie sua primeira arena para começar a receber reservas."}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        {hasFilters && onClearFilters ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        ) : null}
        <Button asChild className="min-h-11">
          <Link href="/owner/arenas/new">Criar primeira arena</Link>
        </Button>
      </div>
    </section>
  );
}
