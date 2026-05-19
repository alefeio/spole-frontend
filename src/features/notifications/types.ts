export type NotificationType = "PAYMENT_CONFIRMED" | "BOOKING_CANCELLED";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType | string;
  readAt: string | null;
  createdAt: string;
};

export type NotificationListParams = {
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type NotificationListResponse = {
  data: Notification[];
  meta: PaginationMeta;
};

export type MarkNotificationReadResponse = {
  id: string;
  readAt: string;
};
