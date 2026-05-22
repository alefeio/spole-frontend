"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrganizerEventsEmptyState } from "@/features/events/components/organizer-events-empty-state";
import { OrganizerEventsErrorState } from "@/features/events/components/organizer-events-error-state";
import { OrganizerEventsFilters } from "@/features/events/components/organizer-events-filters";
import { OrganizerEventsList } from "@/features/events/components/organizer-events-list";
import { OrganizerEventsPagination } from "@/features/events/components/organizer-events-pagination";
import { OrganizerEventsSkeleton } from "@/features/events/components/organizer-events-skeleton";
import { useEventCategories, useMyEvents } from "@/features/events/hooks";
import type { OrganizerEventsListParams } from "@/features/events/types";

const DEFAULT_LIMIT = 10;

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseListParams(searchParams: URLSearchParams): OrganizerEventsListParams {
  const status = searchParams.get("status");
  const visibility = searchParams.get("visibility");
  const type = searchParams.get("type");
  const sourceType = searchParams.get("sourceType");

  return {
    q: searchParams.get("q") || undefined,
    status:
      status === "DRAFT" || status === "PUBLISHED" || status === "CANCELLED" ? status : undefined,
    visibility: visibility === "PUBLIC" || visibility === "PRIVATE" ? visibility : undefined,
    type: type === "FREE" || type === "PAID" ? type : undefined,
    sourceType:
      sourceType === "FREE_LOCATION" || sourceType === "ARENA_RESERVATION" ? sourceType : undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT)
  };
}

export function OrganizerEventsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => parseListParams(searchParams), [searchParams]);

  const eventsQuery = useMyEvents(params);
  const categoriesQuery = useEventCategories();

  function updateUrl(next: Partial<OrganizerEventsListParams>) {
    const query = new URLSearchParams(searchParams.toString());
    const merged = { ...params, ...next };

    for (const [key, value] of Object.entries(merged)) {
      if (value === undefined || value === null || value === "") {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    }

    if (query.get("page") === "1") query.delete("page");
    if (query.get("limit") === String(DEFAULT_LIMIT)) query.delete("limit");

    const suffix = query.toString();
    router.push(suffix ? `/account/events?${suffix}` : "/account/events");
  }

  function handleClear() {
    router.push("/account/events");
  }

  const hasFilters = Boolean(
    params.q ||
    params.status ||
    params.visibility ||
    params.type ||
    params.sourceType ||
    params.categoryId
  );

  const events = eventsQuery.data?.data ?? [];
  const meta = eventsQuery.data?.meta;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <header className="space-y-3 sm:flex sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Meus eventos</h1>
          <p className="text-muted-foreground text-sm">
            Lista dos eventos que você organiza, com filtros e ações rápidas.
          </p>
        </div>
        <div className="grid gap-2 sm:shrink-0">
          <Button asChild className="min-h-11">
            <Link href="/account/events/new">Criar evento</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/account/reservations">Criar a partir de reserva</Link>
          </Button>
        </div>
      </header>

      <OrganizerEventsFilters
        params={params}
        categories={categoriesQuery.data ?? []}
        isLoadingCategories={categoriesQuery.isLoading}
        onChange={updateUrl}
        onClear={handleClear}
      />

      {eventsQuery.isLoading ? <OrganizerEventsSkeleton /> : null}

      {eventsQuery.isError ? (
        <OrganizerEventsErrorState
          error={eventsQuery.error}
          onRetry={() => void eventsQuery.refetch()}
        />
      ) : null}

      {eventsQuery.isSuccess && events.length === 0 ? (
        <OrganizerEventsEmptyState hasFilters={hasFilters} onClearFilters={handleClear} />
      ) : null}

      {eventsQuery.isSuccess && events.length > 0 ? (
        <>
          <OrganizerEventsList events={events} />
          {meta ? (
            <OrganizerEventsPagination meta={meta} onPageChange={(page) => updateUrl({ page })} />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
