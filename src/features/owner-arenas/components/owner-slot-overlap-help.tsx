type OwnerSlotOverlapHelpProps = {
  visible: boolean;
};

export function OwnerSlotOverlapHelp({ visible }: OwnerSlotOverlapHelpProps) {
  if (!visible) return null;

  return (
    <div
      className="border-destructive/30 bg-destructive/5 space-y-2 rounded-lg border p-4 text-sm"
      role="alert"
    >
      <p className="text-destructive font-medium">
        Já existe um horário disponível que cruza com esse intervalo. Ajuste o início ou o fim do
        horário.
      </p>
      <ul className="text-muted-foreground list-disc space-y-1 pl-5">
        <li>Confira se o espaço correto está selecionado.</li>
        <li>Verifique início e término do horário.</li>
        <li>Tente outro intervalo sem sobreposição.</li>
      </ul>
    </div>
  );
}
