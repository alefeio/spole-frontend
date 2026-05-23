export type AdminPaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type AdminListParams = {
  page?: number;
  limit?: number;
};

export type AdminListResponse<T> = {
  data: T[];
  meta: AdminPaginationMeta;
};

export type AdminReasonPayload = {
  reason: string;
};
