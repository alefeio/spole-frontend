"use client";

import { Button } from "@/components/ui/button";
import { OwnerDayDateControls } from "@/features/owner-arenas/components/owner-day-date-controls";

type OwnerSlotListToolbarProps = {
  dateValue: string;
  onDateChange: (date: string) => void;
  showCreate: boolean;
  onToggleCreate: () => void;
};

export function OwnerSlotListToolbar({
  dateValue,
  onDateChange,
  showCreate,
  onToggleCreate
}: OwnerSlotListToolbarProps) {
  return (
    <section className="space-y-4 rounded-xl border p-4">
      <OwnerDayDateControls
        id="slot-date"
        label="Data dos horários"
        value={dateValue}
        onChange={onDateChange}
      />
      <Button type="button" className="min-h-11 w-full sm:w-auto" onClick={onToggleCreate}>
        {showCreate ? "Fechar formulário" : "Criar horário disponível"}
      </Button>
    </section>
  );
}
