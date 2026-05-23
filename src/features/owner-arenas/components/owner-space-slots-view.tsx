"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AccessDenied } from "@/components/feedback/access-denied";
import { useMe } from "@/features/auth/hooks";
import { dayRangeFromDateInput, todayDateInputValue } from "@/lib/date/iso-day-range";
import { OwnerArenaNav } from "@/features/owner/components/owner-arena-nav";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { formatOwnerDateTime, formatOwnerMoney } from "@/features/owner/utils";
import { useOwnerArenaSpaces } from "@/features/owner-arenas/hooks";
import {
  createSlotFormSchema,
  createSlotFormToPayload,
  type CreateSlotFormValues
} from "@/features/owner-arenas/schemas";
import type { Arena } from "@/features/arenas/types";
import { createSlot, listSlotsBySpace } from "@/features/slots/api";
import { getApiErrorMessage } from "@/lib/api/error-messages";

const SLOTS_LIMIT = 50;
const inputClass = "border-input bg-background min-h-11 w-full rounded-md border px-3 py-2 text-sm";

type OwnerSpaceSlotsViewProps = {
  arena: Arena;
  spaceId: string;
};

export function OwnerSpaceSlotsView({ arena, spaceId }: OwnerSpaceSlotsViewProps) {
  const me = useMe();
  const queryClient = useQueryClient();
  const spacesQuery = useOwnerArenaSpaces(arena.id);
  const space = spacesQuery.data?.find((s) => s.id === spaceId);
  const [dateValue, setDateValue] = useState(todayDateInputValue);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [slotForm, setSlotForm] = useState<CreateSlotFormValues>({
    startAtLocal: "",
    endAtLocal: "",
    price: 0,
    allowsRecurring: false,
    notes: ""
  });
  const [message, setMessage] = useState<string | null>(null);

  const range = useMemo(() => dayRangeFromDateInput(dateValue), [dateValue]);

  const slotsQuery = useQuery({
    queryKey: ["owner", "slots", spaceId, page, range.dateFrom, range.dateTo],
    queryFn: () =>
      listSlotsBySpace(spaceId, {
        page,
        limit: SLOTS_LIMIT,
        dateFrom: range.dateFrom,
        dateTo: range.dateTo
      }),
    enabled: Boolean(spaceId)
  });

  const createMutation = useMutation({
    mutationFn: (payload: ReturnType<typeof createSlotFormToPayload>) =>
      createSlot(spaceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner", "slots", spaceId] });
      setShowCreate(false);
    }
  });

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const parsed = createSlotFormSchema.safeParse(slotForm);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    createMutation.mutate(createSlotFormToPayload(parsed.data), {
      onError: (error) => setMessage(getApiErrorMessage(error))
    });
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title={space?.name ?? "Horários"}
        description="Horários com status AVAILABLE nesta data — reservas ocupadas aparecem em Reservas/Agenda."
        actions={<OwnerArenaNav arenaId={arena.id} />}
      />

      <div className="space-y-2">
        <Label htmlFor="slot-date">Data</Label>
        <input
          id="slot-date"
          type="date"
          className={inputClass}
          value={dateValue}
          onChange={(e) => {
            setDateValue(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        onClick={() => setShowCreate((v) => !v)}
      >
        {showCreate ? "Fechar criação" : "Criar horário"}
      </Button>

      {showCreate ? (
        <OwnerSectionCard title="Novo horário (POST /spaces/:spaceId/slots)">
          <form className="space-y-4" onSubmit={handleCreateSlot}>
            <div className="space-y-2">
              <Label>Início</Label>
              <input
                type="datetime-local"
                className={inputClass}
                value={slotForm.startAtLocal}
                onChange={(e) => setSlotForm((f) => ({ ...f, startAtLocal: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Término</Label>
              <input
                type="datetime-local"
                className={inputClass}
                value={slotForm.endAtLocal}
                onChange={(e) => setSlotForm((f) => ({ ...f, endAtLocal: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <input
                type="number"
                min={0}
                step="0.01"
                className={inputClass}
                value={slotForm.price}
                onChange={(e) => setSlotForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={slotForm.allowsRecurring}
                onChange={(e) => setSlotForm((f) => ({ ...f, allowsRecurring: e.target.checked }))}
              />
              Permite recorrência no slot
            </label>
            <Button type="submit" className="min-h-11" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Criando…" : "Criar horário"}
            </Button>
          </form>
        </OwnerSectionCard>
      ) : null}

      {message ? <p className="text-destructive text-sm">{message}</p> : null}

      {slotsQuery.isLoading ? <p className="text-muted-foreground text-sm">Carregando…</p> : null}
      {slotsQuery.isError ? (
        <p className="text-destructive text-sm">{getApiErrorMessage(slotsQuery.error)}</p>
      ) : null}

      {slotsQuery.isSuccess && slotsQuery.data.data.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum horário disponível nesta data.</p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {slotsQuery.data?.data.map((slot) => (
          <li key={slot.id} className="rounded-lg border px-3 py-2 text-sm">
            <p className="font-medium">
              {formatOwnerDateTime(slot.startAt)} — {formatOwnerDateTime(slot.endAt)}
            </p>
            <p>
              {formatOwnerMoney(slot.price)} · {slot.status}
            </p>
            {slot.notes ? <p className="text-muted-foreground text-xs">{slot.notes}</p> : null}
          </li>
        ))}
      </ul>

      {slotsQuery.data?.meta ? (
        <PaginationControls
          page={slotsQuery.data.meta.page}
          limit={slotsQuery.data.meta.limit}
          total={slotsQuery.data.meta.total}
          onPageChange={setPage}
        />
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href={`/owner/arenas/${arena.id}/spaces`}>← Espaços</Link>
      </Button>
    </div>
  );
}
