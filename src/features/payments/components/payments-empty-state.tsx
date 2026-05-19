import { EmptyState } from "@/components/feedback/section-state";

export function PaymentsEmptyState() {
  return (
    <EmptyState
      title="Nenhum pagamento encontrado"
      description="Pagamentos criados pelos fluxos de eventos aparecerao aqui."
    />
  );
}
