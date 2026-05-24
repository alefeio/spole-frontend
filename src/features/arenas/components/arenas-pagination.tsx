"use client";

import { PaginationControls } from "@/components/pagination/pagination-controls";
import type { PublicArenasListMeta } from "@/features/arenas/types";

type ArenasPaginationProps = {
  meta: PublicArenasListMeta;
  onPageChange: (page: number) => void;
};

export function ArenasPagination({ meta, onPageChange }: ArenasPaginationProps) {
  return (
    <PaginationControls
      page={meta.page}
      limit={meta.limit}
      total={meta.total}
      onPageChange={onPageChange}
    />
  );
}
