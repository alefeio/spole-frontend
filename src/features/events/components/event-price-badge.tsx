import type { EventDetails, EventType } from "@/features/events/types";

type EventPriceBadgeProps = {
  type: EventType;
  pricePerPerson: EventDetails["pricePerPerson"];
};

export function EventPriceBadge({ type, pricePerPerson }: EventPriceBadgeProps) {
  const label =
    type === "FREE"
      ? "Gratuito"
      : typeof pricePerPerson === "number"
        ? new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          }).format(pricePerPerson)
        : "Valor a confirmar";

  return (
    <span className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-sm font-medium">
      {label}
    </span>
  );
}
