"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArenaCatalogCard } from "@/features/arenas/components/arena-catalog-card";
import { ArenasDirectOpen } from "@/features/arenas/components/arenas-direct-open";
import { ArenasEmptyState } from "@/features/arenas/components/arenas-empty-state";
import { ArenasErrorState } from "@/features/arenas/components/arenas-error-state";
import { ArenasFilters } from "@/features/arenas/components/arenas-filters";
import { ArenasPagination } from "@/features/arenas/components/arenas-pagination";
import { ArenasSkeleton } from "@/features/arenas/components/arenas-skeleton";
import { useArenas } from "@/features/arenas/hooks";
import type { PublicArenasListParams } from "@/features/arenas/types";

const DEFAULT_LIMIT = 9;

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSort(
  value: string | null
): Pick<PublicArenasListParams, "sort" | "order"> | undefined {
  if (!value) return undefined;
  const [sort, order] = value.split(":");
  if (sort !== "name" && sort !== "createdAt" && sort !== "updatedAt") return undefined;
  if (order !== "asc" && order !== "desc") return undefined;
  return { sort, order };
}

export function ArenasCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params: PublicArenasListParams = useMemo(() => {
    const sortPair = parseSort(searchParams.get("sortOrder"));
    return {
      q: searchParams.get("q") || undefined,
      city: searchParams.get("city") || undefined,
      state: searchParams.get("state") || undefined,
      district: searchParams.get("district") || undefined,
      page: parsePositiveInt(searchParams.get("page"), 1),
      limit: parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT),
      sort: sortPair?.sort ?? "updatedAt",
      order: sortPair?.order ?? "desc"
    };
  }, [searchParams]);

  const arenasQuery = useArenas(params);

  function updateUrl(next: Partial<PublicArenasListParams>) {
    const query = new URLSearchParams(searchParams.toString());
    const merged = { ...params, ...next };

    for (const [key, value] of Object.entries(merged)) {
      if (key === "sort" || key === "order") continue;
      if (value === undefined || value === null || value === "") {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    }

    if (merged.sort || merged.order) {
      query.set("sortOrder", `${merged.sort ?? "updatedAt"}:${merged.order ?? "desc"}`);
    } else {
      query.delete("sortOrder");
    }

    if (query.get("page") === "1") query.delete("page");
    if (query.get("limit") === String(DEFAULT_LIMIT)) query.delete("limit");

    const suffix = query.toString();
    router.push(suffix ? `/arenas?${suffix}` : "/arenas");
  }

  const hasFilters = Boolean(params.q || params.city || params.state || params.district);
  const arenas = arenasQuery.data?.data ?? [];

  return (
    <div className="space-y-8 overflow-x-hidden">
      <header className="space-y-2">
        <p className="text-primary text-sm font-medium tracking-wide uppercase">
          Arenas esportivas
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Encontre uma quadra</h1>
        <p className="text-muted-foreground max-w-2xl">
          Busque por nome, cidade ou endereço e reserve horários nos espaços disponíveis.
        </p>
      </header>

      <ArenasFilters
        params={params}
        hasFilters={hasFilters}
        onChange={updateUrl}
        onClear={() => router.push("/arenas")}
      />

      {arenasQuery.isLoading || (arenasQuery.isPending && arenasQuery.isPaused) ? (
        <ArenasSkeleton />
      ) : null}

      {arenasQuery.isError ? (
        <ArenasErrorState error={arenasQuery.error} onRetry={() => void arenasQuery.refetch()} />
      ) : null}

      {arenasQuery.isSuccess && arenas.length === 0 ? (
        <ArenasEmptyState hasFilters={hasFilters} />
      ) : null}

      {arenasQuery.isSuccess && arenas.length > 0 ? (
        <div className="space-y-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {arenas.map((arena) => (
              <ArenaCatalogCard key={arena.id} arena={arena} />
            ))}
          </ul>
          <ArenasPagination
            meta={arenasQuery.data.meta}
            onPageChange={(page) => updateUrl({ page })}
          />
        </div>
      ) : null}

      <ArenasDirectOpen />
    </div>
  );
}
