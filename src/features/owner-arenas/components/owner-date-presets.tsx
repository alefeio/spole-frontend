"use client";

import { Button } from "@/components/ui/button";
import {
  getNextWeekDate,
  getTodayDate,
  getTomorrowDate
} from "@/features/owner-arenas/utils/owner-date-presets";

type OwnerDatePresetsProps = {
  value: string;
  onChange: (date: string) => void;
};

export function OwnerDatePresets({ value, onChange }: OwnerDatePresetsProps) {
  const presets = [
    { label: "Hoje", date: getTodayDate() },
    { label: "Amanhã", date: getTomorrowDate() },
    { label: "+7 dias", date: getNextWeekDate() }
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <Button
          key={preset.label}
          type="button"
          variant={value === preset.date ? "default" : "outline"}
          className="min-h-11"
          onClick={() => onChange(preset.date)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
