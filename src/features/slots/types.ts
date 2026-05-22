export type Slot = {
  id: string;
  spaceId: string;
  startAt: string;
  endAt: string;
  price: number;
  status: string;
  allowsRecurring: boolean;
  notes: string | null;
};

export type SlotListParams = {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type SlotListResponse = {
  data: Slot[];
  meta: PaginationMeta;
};
