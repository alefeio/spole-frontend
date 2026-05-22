"use client";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";

type ReservationCancelDialogProps = {
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ReservationCancelDialog({
  isPending,
  onConfirm,
  onCancel
}: ReservationCancelDialogProps) {
  return (
    <ConfirmDialog
      title="Cancelar reserva de arena?"
      description="O horário pode voltar a ficar disponível. Esta ação usa PATCH /reservations/:id/cancel."
      confirmLabel="Cancelar reserva"
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
