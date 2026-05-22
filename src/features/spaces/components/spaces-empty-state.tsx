export function SpacesEmptyState() {
  return (
    <div className="bg-muted/40 rounded-xl border p-6 text-center">
      <h2 className="font-semibold">Nenhum espaço cadastrado</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Esta arena ainda não possui espaços publicados para reserva.
      </p>
    </div>
  );
}
