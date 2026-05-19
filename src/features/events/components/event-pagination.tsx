"use client";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/features/events/types";

type EventPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function EventPagination({ meta, onPageChange }: EventPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));
  const canGoPrevious = meta.page > 1;
  const canGoNext = meta.page < totalPages;

  if (meta.total <= meta.limit && meta.page === 1) return null;

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
      aria-label="Paginação de eventos"
    >
      <p className="text-muted-foreground text-sm">
        Página {meta.page} de {totalPages} · {meta.total} evento{meta.total === 1 ? "" : "s"}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canGoNext}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Próxima
        </Button>
      </div>
    </nav>
  );
}
