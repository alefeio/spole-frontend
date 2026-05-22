"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventEmptyState } from "@/features/events/components/event-empty-state";
import { EventErrorState } from "@/features/events/components/event-error-state";
import { EventFilters } from "@/features/events/components/event-filters";
import { EventList } from "@/features/events/components/event-list";
import { EventListSkeleton } from "@/features/events/components/event-list-skeleton";
import { EventPagination } from "@/features/events/components/event-pagination";
import { useEventCategories, useEvents } from "@/features/events/hooks";
import type { EventListParams } from "@/features/events/types";

const DEFAULT_LIMIT = 9;

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function EventsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params: EventListParams = useMemo(
    () => ({
      q: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      page: parsePositiveInt(searchParams.get("page"), 1),
      limit: parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT)
    }),
    [searchParams]
  );

  const eventsQuery = useEvents(params);
  const categoriesQuery = useEventCategories();

  function updateUrl(next: Partial<EventListParams>) {
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
    router.push(suffix ? `/events?${suffix}` : "/events");
  }

  function handleSearch(value: string) {
    updateUrl({ q: value || undefined, page: 1 });
  }

  function handleCategoryChange(value: string) {
    updateUrl({ category: value || undefined, page: 1 });
  }

  function handleClear() {
    router.push("/events");
  }

  const hasFilters = Boolean(params.q || params.category);
  const events = eventsQuery.data?.data ?? [];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-primary text-sm font-medium tracking-wide uppercase">
          Eventos perto de você
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Escolha sua próxima atividade
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Futebol, vôlei, corridas, treinos em grupo e mais — filtre por cidade e categoria e
          garanta sua vaga antes de lotar.
        </p>
      </header>

      <EventFilters
        q={params.q}
        category={params.category}
        categories={categoriesQuery.data ?? []}
        isLoadingCategories={categoriesQuery.isLoading}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onClear={handleClear}
      />

      {eventsQuery.isLoading || (eventsQuery.isPending && eventsQuery.isPaused) ? (
        <EventListSkeleton />
      ) : null}

      {eventsQuery.isError ? (
        <EventErrorState error={eventsQuery.error} onRetry={() => void eventsQuery.refetch()} />
      ) : null}

      {eventsQuery.isSuccess && events.length === 0 ? (
        <EventEmptyState hasFilters={hasFilters} />
      ) : null}

      {eventsQuery.isSuccess && events.length > 0 ? (
        <div className="space-y-6">
          <EventList events={events} />
          <EventPagination
            meta={eventsQuery.data.meta}
            onPageChange={(page) => updateUrl({ page })}
          />
        </div>
      ) : null}
    </div>
  );
}
