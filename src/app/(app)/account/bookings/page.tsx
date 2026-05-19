"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { BookingList } from "@/features/bookings/components/booking-list";
import { BookingsEmptyState } from "@/features/bookings/components/bookings-empty-state";
import { BookingsErrorState } from "@/features/bookings/components/bookings-error-state";
import { BookingsSkeleton } from "@/features/bookings/components/bookings-skeleton";
import { useMyBookings } from "@/features/bookings/hooks";
import { ParticipantList } from "@/features/participants/components/participant-list";
import { useMyParticipants } from "@/features/participants/hooks";

const DEFAULT_LIMIT = 10;

function parsePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function AccountBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const bookingsQuery = useMyBookings({ page, limit: DEFAULT_LIMIT });
  const participantsQuery = useMyParticipants();

  function handlePageChange(nextPage: number) {
    const query = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) query.delete("page");
    else query.set("page", String(nextPage));
    const suffix = query.toString();
    router.push(suffix ? `/account/bookings?${suffix}` : "/account/bookings");
  }

  const bookingsData = bookingsQuery.data;
  const bookings = bookingsData?.data ?? [];
  const participants = participantsQuery.data ?? [];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Minhas inscrições</h1>
        <p className="text-muted-foreground text-sm">
          Inscrições gratuitas e reservas temporárias de eventos pagos.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Inscrições gratuitas</h2>
        {participantsQuery.isLoading ? <BookingsSkeleton /> : null}
        {participantsQuery.isError ? (
          <BookingsErrorState
            error={participantsQuery.error}
            onRetry={() => void participantsQuery.refetch()}
          />
        ) : null}
        {participantsQuery.isSuccess && participants.length === 0 ? <BookingsEmptyState /> : null}
        {participants.length > 0 ? <ParticipantList participants={participants} /> : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reservas de eventos pagos</h2>
        {bookingsQuery.isLoading ? <BookingsSkeleton /> : null}
        {bookingsQuery.isError ? (
          <BookingsErrorState
            error={bookingsQuery.error}
            onRetry={() => void bookingsQuery.refetch()}
          />
        ) : null}
        {bookingsQuery.isSuccess && bookings.length === 0 ? <BookingsEmptyState /> : null}
        {bookingsData && bookings.length > 0 ? (
          <div className="space-y-5">
            <BookingList bookings={bookings} />
            <PaginationControls
              page={bookingsData.meta.page}
              limit={bookingsData.meta.limit}
              total={bookingsData.meta.total}
              onPageChange={handlePageChange}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
