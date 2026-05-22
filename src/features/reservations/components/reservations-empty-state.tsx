export function ReservationsEmptyState() {
  return (
    <div className="bg-muted/40 rounded-xl border p-6 text-center">
      <h2 className="font-semibold">Nenhuma reserva de arena</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Quando você reservar um horário em uma arena, ele aparecerá aqui.
      </p>
    </div>
  );
}
