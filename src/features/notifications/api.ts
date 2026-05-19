import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  MarkNotificationReadResponse,
  Notification,
  NotificationListParams,
  NotificationListResponse
} from "@/features/notifications/types";

export async function getMyNotifications(
  params: NotificationListParams = {}
): Promise<NotificationListResponse> {
  const { data, meta } = await apiClient<Notification[]>(endpoints.users.myNotifications, {
    query: {
      page: params.page,
      limit: params.limit
    }
  });

  return {
    data,
    meta: {
      page: Number(meta?.page ?? params.page ?? 1),
      limit: Number(meta?.limit ?? params.limit ?? 10),
      total: Number(meta?.total ?? data.length)
    }
  };
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<MarkNotificationReadResponse> {
  const { data } = await apiClient<MarkNotificationReadResponse>(
    endpoints.notifications.markRead(notificationId),
    {
      method: "PATCH"
    }
  );

  return data;
}
