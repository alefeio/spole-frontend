"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { parseAdminReason } from "@/features/admin/schemas";

type AdminReasonDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

export function AdminReasonDialog({
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isPending,
  onConfirm,
  onCancel
}: AdminReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  function handleConfirm() {
    const parsed = parseAdminReason(reason);
    if (!parsed.ok) {
      setFieldError(parsed.message);
      return;
    }
    setFieldError(null);
    onConfirm(parsed.reason);
  }

  return (
    <div className="bg-muted/50 space-y-4 rounded-lg border p-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-action-reason">Motivo (obrigatório)</Label>
        <textarea
          id="admin-action-reason"
          className="border-input bg-background min-h-[88px] w-full rounded-md border px-3 py-2 text-sm"
          value={reason}
          maxLength={500}
          placeholder="Descreva o motivo da ação operacional"
          onChange={(e) => setReason(e.target.value)}
          aria-invalid={Boolean(fieldError)}
        />
        {fieldError ? <p className="text-destructive text-sm">{fieldError}</p> : null}
        <p className="text-muted-foreground text-xs">Entre 1 e 500 caracteres.</p>
      </div>
      <div className="grid gap-2 sm:flex">
        <Button
          type="button"
          variant="destructive"
          className="min-h-11 sm:min-h-9"
          disabled={isPending}
          onClick={handleConfirm}
        >
          {isPending ? "Processando…" : confirmLabel}
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
