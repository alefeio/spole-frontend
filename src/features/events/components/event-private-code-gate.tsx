"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EventPrivateCodeGateProps = {
  eventId: string;
  invalidCodeMessage?: string | null;
};

export function EventPrivateCodeGate({ eventId, invalidCodeMessage }: EventPrivateCodeGateProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setFieldError("Informe o código de acesso.");
      return;
    }
    setFieldError(null);
    const params = new URLSearchParams({ privateCode: trimmed });
    router.replace(`/events/${eventId}?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <header className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Evento privado</h1>
        <p className="text-muted-foreground text-sm">
          Este evento é exclusivo e não aparece na listagem pública. Informe o código de acesso
          fornecido pelo organizador.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-card space-y-4 rounded-xl border p-4 shadow-xs sm:p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="private-code">
            Código de acesso
          </label>
          <Input
            id="private-code"
            name="privateCode"
            type="password"
            autoComplete="off"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (fieldError) setFieldError(null);
            }}
            placeholder="Digite o código"
            className="min-h-11"
          />
          {fieldError ? <p className="text-destructive text-sm">{fieldError}</p> : null}
          {invalidCodeMessage ? (
            <p className="text-destructive text-sm" role="alert">
              {invalidCodeMessage}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="min-h-11 w-full">
          Acessar evento
        </Button>
      </form>
    </div>
  );
}
