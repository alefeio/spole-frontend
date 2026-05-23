"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccessDenied } from "@/components/feedback/access-denied";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMe } from "@/features/auth/hooks";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import {
  patchArenaFormSchema,
  patchArenaFormToPayload,
  type PatchArenaFormValues
} from "@/features/owner-arenas/schemas";
import { usePatchArena } from "@/features/owner-arenas/hooks";
import type { Arena } from "@/features/arenas/types";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const inputClass = "border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 text-sm";

function arenaToForm(arena: Arena): PatchArenaFormValues {
  return {
    name: arena.name,
    description: arena.description ?? "",
    phone: arena.phone,
    email: arena.email,
    document: arena.document,
    status: arena.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    zipCode: arena.address.zipCode ?? "",
    street: arena.address.street ?? "",
    number: arena.address.number ?? "",
    district: arena.address.district ?? "",
    city: arena.address.city ?? "",
    state: arena.address.state ?? "",
    allowRecurring: arena.policy.allowRecurring,
    minAdvanceHours: arena.policy.minAdvanceHours,
    minReservationPaymentPercent: arena.policy.minReservationPaymentPercent
  };
}

type OwnerArenaEditFormProps = {
  arena: Arena;
};

export function OwnerArenaEditForm({ arena }: OwnerArenaEditFormProps) {
  const router = useRouter();
  const me = useMe();
  const [values, setValues] = useState(() => arenaToForm(arena));
  const [message, setMessage] = useState<string | null>(null);
  const mutation = usePatchArena();

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return (
      <AccessDenied
        title="Arena de outro dono"
        description="Você só pode editar arenas da sua conta."
      />
    );
  }

  function setField<K extends keyof PatchArenaFormValues>(key: K, value: PatchArenaFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = patchArenaFormSchema.safeParse(values);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Verifique os dados.");
      return;
    }
    mutation.mutate(
      { arenaId: arena.id, payload: patchArenaFormToPayload(parsed.data) },
      {
        onSuccess: () => router.push(`/owner/arenas/${arena.id}`),
        onError: (error) => setMessage(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader title="Editar arena" description={arena.name} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nome</Label>
          <input
            id="edit-name"
            className={inputClass}
            value={values.name ?? ""}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-desc">Descrição</Label>
          <textarea
            id="edit-desc"
            className={`${inputClass} min-h-[88px]`}
            value={values.description ?? ""}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Telefone</Label>
            <input
              id="edit-phone"
              className={inputClass}
              value={values.phone ?? ""}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">E-mail</Label>
            <input
              id="edit-email"
              type="email"
              className={inputClass}
              value={values.email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-status">Status</Label>
          <select
            id="edit-status"
            className={inputClass}
            value={values.status ?? "ACTIVE"}
            onChange={(e) => setField("status", e.target.value as "ACTIVE" | "INACTIVE")}
          >
            <option value="ACTIVE">Ativa</option>
            <option value="INACTIVE">Inativa</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-city">Cidade</Label>
          <input
            id="edit-city"
            className={inputClass}
            value={values.city ?? ""}
            onChange={(e) => setField("city", e.target.value)}
          />
        </div>

        {message ? (
          <p className="bg-muted rounded-lg border p-3 text-sm" role="alert">
            {message}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="min-h-11" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando…" : "Salvar"}
          </Button>
          <Button asChild type="button" variant="outline" className="min-h-11">
            <Link href={`/owner/arenas/${arena.id}`}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
