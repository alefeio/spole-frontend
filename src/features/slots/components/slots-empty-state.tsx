export function SlotsEmptyState() {
  return (
    <div className="bg-muted/40 rounded-xl border p-6 text-center">
      <h2 className="font-semibold">Nenhum horário disponível</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Não há horários disponíveis para esta data. Tente outro dia.
      </p>
    </div>
  );
}
