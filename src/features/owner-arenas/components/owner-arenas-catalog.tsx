"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OwnerPageHeader } from "@/features/owner/components/owner-page-header";
import { OwnerArenasEmptyState } from "@/features/owner-arenas/components/owner-arenas-empty-state";
import { OwnerArenasErrorState } from "@/features/owner-arenas/components/owner-arenas-error-state";
import { OwnerArenasFilters } from "@/features/owner-arenas/components/owner-arenas-filters";
import { OwnerArenasList } from "@/features/owner-arenas/components/owner-arenas-list";
import { OwnerArenasPagination } from "@/features/owner-arenas/components/owner-arenas-pagination";
import { OwnerArenasSkeleton } from "@/features/owner-arenas/components/owner-arenas-skeleton";
import { useMyArenas } from "@/features/owner-arenas/hooks";
import type { OwnerArenasListParams } from "@/features/owner-arenas/types";
import {
  buildOwnerQueryString,
  OWNER_ARENAS_DEFAULT_LIMIT,
  parseOwnerPositiveInt
} from "@/features/owner/utils";

const BASE = "/owner/arenas";

function parseParams(searchParams: URLSearchParams): OwnerArenasListParams {
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  return {
    page: parseOwnerPositiveInt(searchParams.get("page"), 1),
    limit: parseOwnerPositiveInt(searchParams.get("limit"), OWNER_ARENAS_DEFAULT_LIMIT),
    q: searchParams.get("q") || undefined,
    city: searchParams.get("city") || undefined,
    status: status === "ACTIVE" || status === "INACTIVE" ? status : undefined,
    sort: sort === "name" || sort === "createdAt" || sort === "updatedAt" ? sort : "createdAt",
    order: order === "asc" || order === "desc" ? order : "desc"
  };
}

export function OwnerArenasCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useMyArenas(params);

  function updateUrl(next: Partial<OwnerArenasListParams>) {
    router.push(
      buildOwnerQueryString(
        BASE,
        { ...params, ...next },
        { page: 1, limit: OWNER_ARENAS_DEFAULT_LIMIT }
      )
    );
  }

  const hasFilters = Boolean(params.q || params.status || params.city);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <OwnerPageHeader
        title="Minhas arenas"
        description="Veja, filtre e abra as arenas que você cadastrou."
        actions={
          <Button asChild className="min-h-11">
            <Link href="/owner/arenas/new">Criar nova arena</Link>
          </Button>
        }
      />

      <OwnerArenasFilters
        params={params}
        hasFilters={hasFilters}
        onChange={updateUrl}
        onClear={() => router.push(BASE)}
      />

      {query.isLoading ? <OwnerArenasSkeleton /> : null}
      {query.isError ? (
        <OwnerArenasErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : null}

      {query.isSuccess && query.data.data.length === 0 ? (
        <OwnerArenasEmptyState
          hasFilters={hasFilters}
          onClearFilters={hasFilters ? () => router.push(BASE) : undefined}
        />
      ) : null}

      {query.isSuccess && query.data.data.length > 0 ? (
        <>
          <OwnerArenasList arenas={query.data.data} />
          <OwnerArenasPagination
            meta={query.data.meta}
            onPageChange={(page) => updateUrl({ page })}
          />
        </>
      ) : null}

      <Button asChild variant="ghost" className="min-h-11 px-0">
        <Link href="/owner">← Painel da arena</Link>
      </Button>
    </div>
  );
}
