import { SlotCard } from "@/features/slots/components/slot-card";
import type { Slot } from "@/features/slots/types";

type SlotListProps = {
  slots: Slot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
};

export function SlotList({ slots, selectedSlotId, onSelectSlot }: SlotListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {slots.map((slot) => (
        <SlotCard
          key={slot.id}
          slot={slot}
          selected={selectedSlotId === slot.id}
          onSelect={() => onSelectSlot(slot.id)}
        />
      ))}
    </div>
  );
}
