import { dayRangeFromDateInput } from "@/lib/date/iso-day-range";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toOwnerDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getTodayDate(): string {
  return toOwnerDateInputValue(new Date());
}

export function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toOwnerDateInputValue(d);
}

export function getNextWeekDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return toOwnerDateInputValue(d);
}

export function shiftOwnerDate(dateInput: string, days: number): string {
  const [year, month, day] = dateInput.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return toOwnerDateInputValue(d);
}

export function isSameOwnerCalendarDay(isoA: string, dateInput: string): boolean {
  const a = new Date(isoA);
  const b = new Date(`${dateInput}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const buildDayRange = dayRangeFromDateInput;
