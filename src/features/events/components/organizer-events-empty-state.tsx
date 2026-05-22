import Link from "next/link";
import { Button } from "@/components/ui/button";

type OrganizerEventsEmptyStateProps = {
  hasFilters: boolean;
  onClearFilters?: () => void;
};

export function OrganizerEventsEmptyState({
  hasFilters,
  onClearFilters
}: OrganizerEventsEmptyStateProps) {
  return (
    <section className="space-y-4 rounded-xl border border-dashed p-6 text-center">
      <h2 className="text-lg font-semibold">
        {hasFilters ? "Nenhum evento com esses filtros" : "Você ainda não criou eventos"}
      </h2>
      <p className="text-muted-foreground text-sm">
        {hasFilters
          ? "Tente outros filtros ou limpe a busca."
          : "Crie um evento em local livre ou a partir de uma reserva confirmada."}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        {hasFilters && onClearFilters ? (
          <Button type="button" variant="outline" className="min-h-11" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        ) : null}
        <Button asChild className="min-h-11">
          <Link href="/account/events/new">Criar evento</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/account/reservations">Ver reservas</Link>
        </Button>
      </div>
    </section>
  );
}
