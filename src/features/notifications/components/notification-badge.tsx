import type { Notification } from "@/features/notifications/types";

export function NotificationBadge({ notification }: { notification: Notification }) {
  return (
    <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium">
      {notification.readAt ? "Lida" : "Nova"}
    </span>
  );
}
