"use client";

import { EventPagination } from "@/features/events/components/event-pagination";
import type { PaginationMeta } from "@/features/events/types";

type OrganizerEventsPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function OrganizerEventsPagination({ meta, onPageChange }: OrganizerEventsPaginationProps) {
  return <EventPagination meta={meta} onPageChange={onPageChange} />;
}
