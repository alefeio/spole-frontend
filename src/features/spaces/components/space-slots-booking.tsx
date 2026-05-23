"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { useCreateReservation } from "@/features/reservations/hooks";
import { SlotDatePicker } from "@/features/slots/components/slot-date-picker";
import { SlotList } from "@/features/slots/components/slot-list";
import { SlotsEmptyState } from "@/features/slots/components/slots-empty-state";
import { SlotsErrorState } from "@/features/slots/components/slots-error-state";
import { SlotsSkeleton } from "@/features/slots/components/slots-skeleton";
import { useSlotsBySpace } from "@/features/slots/hooks";
import { hasToken } from "@/lib/auth/token";
import { dayRangeFromDateInput, todayDateInputValue } from "@/lib/date/iso-day-range";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import type { ArenaSpace } from "@/features/arenas/types";

const SLOTS_LIMIT = 50;

type SpaceSlotsBookingProps = {
  arenaId: string;
  space: ArenaSpace;
  bookingEnabled: boolean;
};

export function SpaceSlotsBooking({ arenaId, space, bookingEnabled }: SpaceSlotsBookingProps) {
  const router = useRouter();
  const [dateValue, setDateValue] = useState(todayDateInputValue);
  const [page, setPage] = useState(1);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const range = useMemo(() => dayRangeFromDateInput(dateValue), [dateValue]);
  const slotsQuery = useSlotsBySpace(space.id, {
    page,
    limit: SLOTS_LIMIT,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo
  });
  const meQuery = useMe();
  const createMutation = useCreateReservation();
  const isLoggedIn = hasToken();
  const loginHref = `/login?redirect=${encodeURIComponent(`/arenas/${arenaId}/spaces/${space.id}`)}`;

  const slots = slotsQuery.data?.data ?? [];
  const meta = slotsQuery.data?.meta;

  function handleDateChange(next: string) {
    setDateValue(next);
    setPage(1);
    setSelectedSlotId(null);
    setFeedback(null);
  }

  function handleReserve() {
    if (!selectedSlotId) {
      setFeedback("Selecione um horário para continuar.");
      return;
    }
    setFeedback(null);
    createMutation.mutate(
      { slotId: selectedSlotId, type: "SINGLE" },
      {
        onSuccess: (data) => {
          router.push(`/account/reservations/${data.id}`);
        },
        onError: (error) => setFeedback(getApiErrorMessage(error))
      }
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">
          <Link href={`/arenas/${arenaId}`} className="hover:underline">
            ← Voltar para a arena
          </Link>
        </p>
        <h1 className="text-2xl font-bold tracking-tight break-words sm:text-3xl">{space.name}</h1>
        <p className="text-muted-foreground text-sm">{space.type}</p>
      </header>

      {!bookingEnabled ? (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-3 text-sm">
          A arena não está ativa. Não é possível reservar horários neste momento.
        </p>
      ) : space.status !== "ACTIVE" ? (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-3 text-sm">
          Este espaço não está ativo para reserva.
        </p>
      ) : (
        <>
          <SlotDatePicker value={dateValue} onChange={handleDateChange} />

          {slotsQuery.isLoading ? <SlotsSkeleton /> : null}
          {slotsQuery.isError ? (
            <SlotsErrorState error={slotsQuery.error} onRetry={() => void slotsQuery.refetch()} />
          ) : null}

          {slotsQuery.isSuccess && slots.length === 0 ? <SlotsEmptyState /> : null}

          {slots.length > 0 ? (
            <>
              <SlotList
                slots={slots}
                selectedSlotId={selectedSlotId}
                onSelectSlot={(id) => {
                  setSelectedSlotId(id);
                  setFeedback(null);
                }}
              />
              {meta ? (
                <PaginationControls
                  page={meta.page}
                  limit={meta.limit}
                  total={meta.total}
                  onPageChange={setPage}
                />
              ) : null}
            </>
          ) : null}

          {feedback ? (
            <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
              {feedback}
            </p>
          ) : null}

          {selectedSlotId && bookingEnabled && space.status === "ACTIVE" ? (
            <section className="space-y-3 rounded-xl border p-4">
              <h2 className="font-semibold">Confirmar reserva avulsa</h2>
              <p className="text-muted-foreground text-sm">
                Reserva única (SINGLE). Conforme a política da arena, pode ser necessário pagar
                parte do valor após criar a reserva — você será direcionado ao fluxo de pagamento
                simulado na sua conta. Se o percentual mínimo for 0%, a reserva pode já nascer
                confirmada, conforme a API. O status final sempre vem do servidor.
              </p>

              {!isLoggedIn ? (
                <Button asChild className="min-h-11 w-full sm:min-h-9 sm:w-auto">
                  <Link href={loginHref}>Entrar para reservar</Link>
                </Button>
              ) : meQuery.isLoading ? (
                <p className="text-muted-foreground text-sm">Verificando sessão…</p>
              ) : (
                <Button
                  type="button"
                  className="min-h-11 w-full sm:min-h-9 sm:w-auto"
                  disabled={createMutation.isPending}
                  onClick={handleReserve}
                >
                  {createMutation.isPending ? "Reservando…" : "Reservar horário"}
                </Button>
              )}
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
