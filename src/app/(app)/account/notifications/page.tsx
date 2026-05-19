"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/pagination/pagination-controls";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { NotificationsEmptyState } from "@/features/notifications/components/notifications-empty-state";
import { NotificationsErrorState } from "@/features/notifications/components/notifications-error-state";
import { NotificationsSkeleton } from "@/features/notifications/components/notifications-skeleton";
import { useMyNotifications } from "@/features/notifications/hooks";

const DEFAULT_LIMIT = 10;

function parsePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function AccountNotificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const notificationsQuery = useMyNotifications({ page, limit: DEFAULT_LIMIT });
  const notificationsData = notificationsQuery.data;
  const notifications = notificationsData?.data ?? [];

  function handlePageChange(nextPage: number) {
    const query = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) query.delete("page");
    else query.set("page", String(nextPage));
    const suffix = query.toString();
    router.push(suffix ? `/account/notifications?${suffix}` : "/account/notifications");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notificações</h1>
        <p className="text-muted-foreground text-sm">
          Avisos operacionais sobre suas reservas, pagamentos e participação.
        </p>
      </header>

      {notificationsQuery.isLoading ? <NotificationsSkeleton /> : null}
      {notificationsQuery.isError ? (
        <NotificationsErrorState
          error={notificationsQuery.error}
          onRetry={() => void notificationsQuery.refetch()}
        />
      ) : null}
      {notificationsQuery.isSuccess && notifications.length === 0 ? (
        <NotificationsEmptyState />
      ) : null}
      {notificationsData && notifications.length > 0 ? (
        <div className="space-y-5">
          <NotificationList notifications={notifications} />
          <PaginationControls
            page={notificationsData.meta.page}
            limit={notificationsData.meta.limit}
            total={notificationsData.meta.total}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
}
