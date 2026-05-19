"use client";

import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isPending,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <div className="bg-muted/50 space-y-3 rounded-lg border p-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="grid gap-2 sm:flex">
        <Button
          type="button"
          variant="destructive"
          className="min-h-11 sm:min-h-9"
          disabled={isPending}
          onClick={onConfirm}
        >
          {isPending ? "Confirmando…" : confirmLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 sm:min-h-9"
          disabled={isPending}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}
