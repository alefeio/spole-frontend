"use client";

import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({ page, limit, total, onPageChange }: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  if (total <= limit && page === 1) return null;

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
      aria-label="Paginação"
    >
      <p className="text-muted-foreground text-sm">
        Página {page} de {totalPages} · {total} item{total === 1 ? "" : "s"}
      </p>
      <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
        <Button
          type="button"
          variant="outline"
          className="min-h-11 sm:min-h-9"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 sm:min-h-9"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </Button>
      </div>
    </nav>
  );
}
