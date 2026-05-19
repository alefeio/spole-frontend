"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/error-messages";
import { NotificationBadge } from "@/features/notifications/components/notification-badge";
import { useMarkNotificationAsRead } from "@/features/notifications/hooks";
import type { Notification } from "@/features/notifications/types";

type NotificationCardProps = {
  notification: Notification;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const markReadMutation = useMarkNotificationAsRead();
  const [message, setMessage] = useState<string | null>(null);
  const canMarkRead = !notification.readAt;

  function handleMarkRead() {
    setMessage(null);
    markReadMutation.mutate(notification.id, {
      onSuccess: () => setMessage("Notificação marcada como lida."),
      onError: (error) => setMessage(getApiErrorMessage(error))
    });
  }

  return (
    <article className="space-y-3 rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-semibold break-words">{notification.title}</h2>
          <p className="text-muted-foreground text-xs">{formatDate(notification.createdAt)}</p>
        </div>
        <NotificationBadge notification={notification} />
      </div>

      <p className="text-muted-foreground text-sm break-words">{notification.message}</p>

      {message ? (
        <p className="bg-muted rounded-lg border p-3 text-sm" role="status">
          {message}
        </p>
      ) : null}

      {canMarkRead ? (
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full sm:min-h-9 sm:w-auto"
          disabled={markReadMutation.isPending}
          onClick={handleMarkRead}
        >
          {markReadMutation.isPending ? "Marcando…" : "Marcar como lida"}
        </Button>
      ) : null}
    </article>
  );
}
