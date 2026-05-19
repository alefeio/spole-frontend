"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyNotifications, markNotificationAsRead } from "@/features/notifications/api";
import type { NotificationListParams } from "@/features/notifications/types";

export const notificationsKeys = {
  all: ["notifications"] as const,
  myNotifications: () => [...notificationsKeys.all, "me"] as const,
  myNotificationsList: (params: NotificationListParams) =>
    [...notificationsKeys.myNotifications(), params] as const
};

export function useMyNotifications(params: NotificationListParams = {}) {
  return useQuery({
    queryKey: notificationsKeys.myNotificationsList(params),
    queryFn: () => getMyNotifications(params)
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    }
  });
}
