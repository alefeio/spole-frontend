"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  createArenaFormSchema,
  createArenaFormToPayload,
  type CreateArenaFormValues
} from "@/features/owner-arenas/schemas";
import { useCreateArena } from "@/features/owner-arenas/hooks";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const inputClass = "border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 text-sm";

const INITIAL: CreateArenaFormValues = {
  name: "",
  description: "",
  phone: "",
  email: "",
  document: "",
  zipCode: "",
  street: "",
  number: "",
  district: "",
  city: "",
  state: "",
  allowRecurring: false,
  minAdvanceHours: 24,
  minReservationPaymentPercent: 0
};

export function ArenaOwnerCreateForm() {
  const router = useRouter();
  const [values, setValues] = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useCreateArena();

  function setField<K extends keyof CreateArenaFormValues>(
    key: K,
    value: CreateArenaFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = createArenaFormSchema.safeParse(values);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string" && !errors[path]) errors[path] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    mutation.mutate(createArenaFormToPayload(parsed.data), {
      onSuccess: (data) => router.push(`/owner/arenas/${data.id}`),
      onError: (error) => setMessage(getApiErrorMessage(error))
    });
  }

  return (
    <form className="space-y-6 overflow-x-hidden" onSubmit={handleSubmit}>
      <fieldset className="space-y-4 rounded-xl border p-4">
        <legend className="px-1 text-sm font-semibold">Dados da arena</legend>
        <div className="space-y-2">
          <Label htmlFor="arena-name">Nome *</Label>
          <input
            id="arena-name"
            className={inputClass}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          {fieldErrors.name ? <p className="text-destructive text-sm">{fieldErrors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="arena-desc">Descrição</Label>
          <textarea
            id="arena-desc"
            className={`${inputClass} min-h-[88px]`}
            value={values.description ?? ""}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="arena-phone">Telefone *</Label>
            <input
              id="arena-phone"
              className={inputClass}
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
            {fieldErrors.phone ? (
              <p className="text-destructive text-sm">{fieldErrors.phone}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="arena-email">E-mail *</Label>
            <input
              id="arena-email"
              type="email"
              className={inputClass}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
            />
            {fieldErrors.email ? (
              <p className="text-destructive text-sm">{fieldErrors.email}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="arena-doc">Documento (CNPJ/CPF) *</Label>
          <input
            id="arena-doc"
            className={inputClass}
            value={values.document}
            onChange={(e) => setField("document", e.target.value)}
          />
          {fieldErrors.document ? (
            <p className="text-destructive text-sm">{fieldErrors.document}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border p-4">
        <legend className="px-1 text-sm font-semibold">Endereço</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="arena-zip">CEP *</Label>
            <input
              id="arena-zip"
              className={inputClass}
              value={values.zipCode}
              onChange={(e) => setField("zipCode", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="arena-street">Rua *</Label>
            <input
              id="arena-street"
              className={inputClass}
              value={values.street}
              onChange={(e) => setField("street", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arena-number">Número *</Label>
            <input
              id="arena-number"
              className={inputClass}
              value={values.number}
              onChange={(e) => setField("number", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arena-district">Bairro *</Label>
            <input
              id="arena-district"
              className={inputClass}
              value={values.district}
              onChange={(e) => setField("district", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arena-city">Cidade *</Label>
            <input
              id="arena-city"
              className={inputClass}
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arena-state">UF *</Label>
            <input
              id="arena-state"
              className={inputClass}
              maxLength={2}
              value={values.state}
              onChange={(e) => setField("state", e.target.value.toUpperCase())}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border p-4">
        <legend className="px-1 text-sm font-semibold">Política</legend>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.allowRecurring}
            onChange={(e) => setField("allowRecurring", e.target.checked)}
          />
          Permitir recorrência (quando a API suportar no produto)
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="min-advance">Antecedência mínima (horas)</Label>
            <input
              id="min-advance"
              type="number"
              min={0}
              className={inputClass}
              value={values.minAdvanceHours}
              onChange={(e) => setField("minAdvanceHours", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-pay">% mínimo de pagamento na reserva</Label>
            <input
              id="min-pay"
              type="number"
              min={0}
              max={100}
              className={inputClass}
              value={values.minReservationPaymentPercent}
              onChange={(e) => setField("minReservationPaymentPercent", Number(e.target.value))}
            />
          </div>
        </div>
      </fieldset>

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="alert">
          {message}
        </p>
      ) : null}

      <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={mutation.isPending}>
        {mutation.isPending ? "Criando…" : "Criar arena"}
      </Button>
    </form>
  );
}
