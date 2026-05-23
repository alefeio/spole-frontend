"use client";

import { PaginationControls } from "@/components/pagination/pagination-controls";
import type { OwnerArenasListMeta } from "@/features/owner-arenas/types";

type OwnerArenasPaginationProps = {
  meta: OwnerArenasListMeta;
  onPageChange: (page: number) => void;
};

export function OwnerArenasPagination({ meta, onPageChange }: OwnerArenasPaginationProps) {
  return (
    <PaginationControls
      page={meta.page}
      limit={meta.limit}
      total={meta.total}
      onPageChange={onPageChange}
    />
  );
}
