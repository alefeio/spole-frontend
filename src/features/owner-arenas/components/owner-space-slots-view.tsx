"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessDenied } from "@/components/feedback/access-denied";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/feedback/section-state";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMe } from "@/features/auth/hooks";
import { dayRangeFromDateInput, todayDateInputValue } from "@/lib/date/iso-day-range";
import { OWNER_INPUT_CLASS } from "@/features/owner/components/owner-constants";
import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { OwnerSuccessBanner } from "@/features/owner/components/owner-success-banner";
import { OwnerSlotStatusBadge } from "@/features/owner-arenas/components/owner-slot-status-badge";
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

const defaultSlotForm: CreateSlotFormValues = {
  startAtLocal: "",
  endAtLocal: "",
  price: 0,
  allowsRecurring: false,
  notes: ""
};

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
  const [slotForm, setSlotForm] = useState<CreateSlotFormValues>(defaultSlotForm);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSlotForm(defaultSlotForm);
      setSuccessMessage("Horário criado com sucesso.");
    }
  });

  if (me.isSuccess && me.data && me.data.id !== arena.ownerId) {
    return <AccessDenied title="Arena de outro dono" description="Acesso negado." />;
  }

  function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSuccessMessage(null);
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
        title={space?.name ?? "Horários disponíveis"}
        description="Horários retornados pela API para este espaço na data selecionada."
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <OwnerSectionCard>
        <p className="text-muted-foreground text-sm">
          Esta tela mostra horários disponíveis para reserva. Reservas já realizadas aparecem na
          agenda e em Reservas recebidas.
        </p>
      </OwnerSectionCard>

      <div className="space-y-2">
        <Label htmlFor="slot-date">Data</Label>
        <input
          id="slot-date"
          type="date"
          className={OWNER_INPUT_CLASS}
          value={dateValue}
          onChange={(e) => {
            setDateValue(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Button
        type="button"
        className="min-h-11 w-full sm:w-auto"
        onClick={() => setShowCreate((v) => !v)}
      >
        {showCreate ? "Fechar criação" : "Criar horário"}
      </Button>

      {successMessage ? <OwnerSuccessBanner message={successMessage} /> : null}
      {message ? (
        <p className="text-destructive text-sm" role="alert">
          {message}
        </p>
      ) : null}

      {showCreate ? (
        <OwnerSectionCard title="Novo horário">
          <form className="space-y-4" onSubmit={handleCreateSlot}>
            <div className="space-y-2">
              <Label htmlFor="slot-start">Início *</Label>
              <input
                id="slot-start"
                type="datetime-local"
                className={OWNER_INPUT_CLASS}
                value={slotForm.startAtLocal}
                onChange={(e) => setSlotForm((f) => ({ ...f, startAtLocal: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot-end">Término *</Label>
              <input
                id="slot-end"
                type="datetime-local"
                className={OWNER_INPUT_CLASS}
                value={slotForm.endAtLocal}
                onChange={(e) => setSlotForm((f) => ({ ...f, endAtLocal: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot-price">Preço (R$) *</Label>
              <input
                id="slot-price"
                type="number"
                min={0}
                step="0.01"
                className={OWNER_INPUT_CLASS}
                value={slotForm.price}
                onChange={(e) => setSlotForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slot-notes">Observações</Label>
              <textarea
                id="slot-notes"
                className={`${OWNER_INPUT_CLASS} min-h-20`}
                value={slotForm.notes ?? ""}
                onChange={(e) => setSlotForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <label className="flex min-h-11 items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={slotForm.allowsRecurring}
                onChange={(e) => setSlotForm((f) => ({ ...f, allowsRecurring: e.target.checked }))}
              />
              <span>
                Permite recorrência neste horário (flag informativa — sem fluxo de recorrência nesta
                versão)
              </span>
            </label>
            <Button type="submit" className="min-h-11 w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Criando…" : "Criar horário"}
            </Button>
          </form>
        </OwnerSectionCard>
      ) : null}

      {slotsQuery.isLoading ? <CardsSkeleton count={3} /> : null}
      {slotsQuery.isError ? (
        <ErrorState
          title="Erro ao carregar horários"
          error={slotsQuery.error}
          onRetry={() => void slotsQuery.refetch()}
        />
      ) : null}

      {slotsQuery.isSuccess && slotsQuery.data.data.length === 0 ? (
        <EmptyState
          title="Nenhum horário disponível nesta data"
          description="Crie um horário ou escolha outra data."
        />
      ) : null}

      <ul className="space-y-3">
        {slotsQuery.data?.data.map((slot) => (
          <li key={slot.id}>
            <article className="space-y-2 rounded-xl border p-4 text-sm shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">
                  {formatOwnerDateTime(slot.startAt)} — {formatOwnerDateTime(slot.endAt)}
                </p>
                <OwnerSlotStatusBadge status={slot.status} />
              </div>
              <p className="font-medium">{formatOwnerMoney(slot.price)}</p>
              {slot.allowsRecurring ? (
                <p className="text-muted-foreground text-xs">Recorrência permitida no slot</p>
              ) : null}
              {slot.notes ? (
                <p className="text-muted-foreground break-words">{slot.notes}</p>
              ) : null}
              <p className="text-muted-foreground font-mono text-xs break-all">ID: {slot.id}</p>
            </article>
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
