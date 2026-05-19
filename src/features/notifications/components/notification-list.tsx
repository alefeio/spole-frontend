import { NotificationCard } from "@/features/notifications/components/notification-card";
import type { Notification } from "@/features/notifications/types";

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="grid gap-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
