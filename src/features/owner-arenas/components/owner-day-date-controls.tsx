"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OWNER_INPUT_CLASS } from "@/features/owner/components/owner-constants";
import { OwnerDatePresets } from "@/features/owner-arenas/components/owner-date-presets";
import {
  getTodayDate,
  getTomorrowDate,
  shiftOwnerDate
} from "@/features/owner-arenas/utils/owner-date-presets";

type OwnerDayDateControlsProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (date: string) => void;
  showDayNavigation?: boolean;
};

export function OwnerDayDateControls({
  id,
  label = "Data",
  value,
  onChange,
  showDayNavigation = false
}: OwnerDayDateControlsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <input
          id={id}
          type="date"
          className={OWNER_INPUT_CLASS}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <OwnerDatePresets value={value} onChange={onChange} />

      {showDayNavigation ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => onChange(shiftOwnerDate(value, -1))}
          >
            Dia anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => onChange(getTodayDate())}
          >
            Hoje
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => onChange(getTomorrowDate())}
          >
            Amanhã
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => onChange(shiftOwnerDate(value, 1))}
          >
            Próximo dia
          </Button>
        </div>
      ) : null}
    </div>
  );
}
