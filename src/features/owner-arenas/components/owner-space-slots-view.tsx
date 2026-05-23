"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccessDenied } from "@/components/feedback/access-denied";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/feedback/section-state";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMe } from "@/features/auth/hooks";
import { OWNER_INPUT_CLASS } from "@/features/owner/components/owner-constants";
import { OwnerArenaNavigation } from "@/features/owner/components/owner-arena-navigation";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerSectionCard } from "@/features/owner/components/owner-section-card";
import { OwnerSuccessBanner } from "@/features/owner/components/owner-success-banner";
import { OwnerSlotOverlapHelp } from "@/features/owner-arenas/components/owner-slot-overlap-help";
import { OwnerSlotStatusBadge } from "@/features/owner-arenas/components/owner-slot-status-badge";
import { OwnerSlotListToolbar } from "@/features/owner-arenas/components/slots/owner-slot-list-toolbar";
import {
  ownerArenasKeys,
  useOwnerArenaSpaces,
  useOwnerSpaceSlots
} from "@/features/owner-arenas/hooks";
import {
  createSlotFormSchema,
  createSlotFormToPayload,
  type CreateSlotFormValues
} from "@/features/owner-arenas/schemas";
import { buildDayRange, getTodayDate } from "@/features/owner-arenas/utils/owner-date-presets";
import { formatOwnerDateTime, formatOwnerMoney } from "@/features/owner/utils";
import type { Arena } from "@/features/arenas/types";
import { createSlot } from "@/features/slots/api";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import { ApiError } from "@/lib/api/errors";

const SLOTS_LIMIT = 50;

const defaultSlotForm: CreateSlotFormValues = {
  startAtLocal: "",
  endAtLocal: "",
  price: 0,
  allowsRecurring: false,
  notes: ""
};

const SLOTS_INFO_COPY =
  "Esta tela mostra horários disponíveis para reserva. Horários que já receberam reserva aparecem em Reservas recebidas e na Agenda.";

type OwnerSpaceSlotsViewProps = {
  arena: Arena;
  spaceId: string;
};

export function OwnerSpaceSlotsView({ arena, spaceId }: OwnerSpaceSlotsViewProps) {
  const me = useMe();
  const queryClient = useQueryClient();
  const spacesQuery = useOwnerArenaSpaces(arena.id);
  const space = spacesQuery.data?.find((s) => s.id === spaceId);
  const [dateValue, setDateValue] = useState(getTodayDate);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [slotForm, setSlotForm] = useState<CreateSlotFormValues>(defaultSlotForm);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const range = useMemo(() => buildDayRange(dateValue), [dateValue]);
  const slotParams = useMemo(
    () => ({
      page,
      limit: SLOTS_LIMIT,
      dateFrom: range.dateFrom,
      dateTo: range.dateTo
    }),
    [page, range.dateFrom, range.dateTo]
  );

  const slotsQuery = useOwnerSpaceSlots(spaceId, slotParams);
  const base = `/owner/arenas/${arena.id}`;

  const createMutation = useMutation({
    mutationFn: (payload: ReturnType<typeof createSlotFormToPayload>) =>
      createSlot(spaceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...ownerArenasKeys.all, "slots", spaceId]
      });
      setShowCreate(false);
      setSlotForm(defaultSlotForm);
      setSuccessMessage("Horário criado com sucesso.");
      setMessage(null);
    }
  });

  const showOverlapHelp =
    (createMutation.error instanceof ApiError && createMutation.error.code === "SLOT_OVERLAP") ||
    Boolean(message?.includes("cruza com esse intervalo"));

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

  function handleDateChange(next: string) {
    setDateValue(next);
    setPage(1);
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title={space?.name ?? "Horários disponíveis"}
        description="Crie um horário disponível para reserva neste espaço."
      />

      <OwnerArenaNavigation arenaId={arena.id} />

      <OwnerSectionCard>
        <p className="text-muted-foreground text-sm">{SLOTS_INFO_COPY}</p>
      </OwnerSectionCard>

      <OwnerSlotListToolbar
        dateValue={dateValue}
        onDateChange={handleDateChange}
        showCreate={showCreate}
        onToggleCreate={() => setShowCreate((v) => !v)}
      />

      {successMessage ? <OwnerSuccessBanner message={successMessage} /> : null}

      {showCreate ? (
        <OwnerSectionCard title="Novo horário (criação unitária)">
          <p className="text-muted-foreground mb-4 text-sm">
            Preencha início, término e preço. Cada envio cria um único horário disponível — sem
            repetição automática ou criação em lote.
          </p>
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
                Permite recorrência neste horário (apenas flag informativa — sem fluxo de
                recorrência nesta versão).
              </span>
            </label>
            <Button type="submit" className="min-h-11 w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Criando…" : "Criar horário disponível"}
            </Button>
          </form>
        </OwnerSectionCard>
      ) : null}

      {message && !showOverlapHelp ? (
        <p className="text-destructive text-sm" role="alert">
          {message}
        </p>
      ) : null}
      <OwnerSlotOverlapHelp visible={showOverlapHelp} />

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
          description="Crie um horário ou escolha outra data. Horários já reservados não aparecem aqui."
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

      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/agenda`}>Ver agenda</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={`${base}/reservations`}>Ver reservas recebidas</Link>
        </Button>
        <Button asChild variant="ghost" className="min-h-11 sm:col-span-2">
          <Link href={`${base}/spaces`}>← Voltar aos espaços</Link>
        </Button>
      </div>
    </div>
  );
}
