"use client";

type SlotDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SlotDatePicker({ value, onChange }: SlotDatePickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor="slot-date">
        Data do horário
      </label>
      <input
        id="slot-date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-md border px-3 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none"
      />
    </div>
  );
}
