/** Converte valor de input datetime-local para ISO 8601 com offset do fuso local. */
export function dateTimeLocalToIsoOffset(datetimeLocal: string): string {
  const date = new Date(datetimeLocal);
  if (Number.isNaN(date.getTime())) {
    return datetimeLocal;
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const offsetHours = pad(Math.floor(abs / 60));
  const offsetMinutes = pad(abs % 60);

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${offsetHours}:${offsetMinutes}`
  );
}

/** Converte ISO da API para valor de input datetime-local. */
export function isoToDateTimeLocal(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
