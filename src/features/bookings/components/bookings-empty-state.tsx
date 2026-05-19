import { EmptyState } from "@/components/feedback/section-state";

export function BookingsEmptyState() {
  return (
    <EmptyState
      title="Nenhuma reserva encontrada"
      description="Quando você reservar vaga em eventos pagos, elas aparecerão aqui."
    />
  );
}
