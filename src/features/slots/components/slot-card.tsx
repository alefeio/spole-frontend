import type { Slot } from "@/features/slots/types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatTimeRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Horário inválido";

  const fmt = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

type SlotCardProps = {
  slot: Slot;
  selected: boolean;
  onSelect: () => void;
};

export function SlotCard({ slot, selected, onSelect }: SlotCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`min-h-11 w-full rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-primary bg-primary/5 ring-primary ring-2" : "hover:bg-muted/40"
      }`}
    >
      <p className="font-medium">{formatTimeRange(slot.startAt, slot.endAt)}</p>
      <p className="text-muted-foreground mt-1 text-sm">{formatMoney(slot.price)}</p>
      {slot.notes ? (
        <p className="text-muted-foreground mt-2 text-xs break-words">{slot.notes}</p>
      ) : null}
    </button>
  );
}
