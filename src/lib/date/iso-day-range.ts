function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toIsoWithOffset(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const hours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const minutes = pad(Math.abs(offsetMinutes) % 60);

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${hours}:${minutes}`
  );
}

/** Converte YYYY-MM-DD (input date) em intervalo do dia local com offset para query de slots. */
export function dayRangeFromDateInput(dateValue: string): { dateFrom: string; dateTo: string } {
  const [year, month, day] = dateValue.split("-").map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  return {
    dateFrom: toIsoWithOffset(start),
    dateTo: toIsoWithOffset(end)
  };
}

export function todayDateInputValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
