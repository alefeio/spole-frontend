"use client";

import { PaginationControls } from "@/components/pagination/pagination-controls";
import type { AdminPaginationMeta } from "@/features/admin/types";

type AdminPaginationProps = {
  meta: AdminPaginationMeta;
  onPageChange: (page: number) => void;
};

export function AdminPagination({ meta, onPageChange }: AdminPaginationProps) {
  return (
    <PaginationControls
      page={meta.page}
      limit={meta.limit}
      total={meta.total}
      onPageChange={onPageChange}
    />
  );
}
