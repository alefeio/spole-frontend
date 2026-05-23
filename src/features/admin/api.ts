import { listAdminArenas } from "@/features/admin-arenas/api";
import { listAdminAuditLogs } from "@/features/admin-audit/api";
import { listAdminBookings } from "@/features/admin-bookings/api";
import { listAdminEvents } from "@/features/admin-events/api";
import { listAdminPayments } from "@/features/admin-payments/api";
import { listAdminReservations } from "@/features/admin-reservations/api";
import { listAdminUsers } from "@/features/admin-users/api";

const HUB_PAGE = { page: 1, limit: 1 } as const;

export type AdminHubTotals = {
  users: number;
  events: number;
  reservations: number;
  payments: number;
  arenas: number;
  audit: number;
  bookings: number;
};

export async function fetchAdminHubTotals(): Promise<AdminHubTotals> {
  const [users, events, reservations, payments, arenas, audit, bookings] = await Promise.all([
    listAdminUsers(HUB_PAGE),
    listAdminEvents(HUB_PAGE),
    listAdminReservations(HUB_PAGE),
    listAdminPayments(HUB_PAGE),
    listAdminArenas(HUB_PAGE),
    listAdminAuditLogs(HUB_PAGE),
    listAdminBookings(HUB_PAGE)
  ]);

  return {
    users: users.meta.total,
    events: events.meta.total,
    reservations: reservations.meta.total,
    payments: payments.meta.total,
    arenas: arenas.meta.total,
    audit: audit.meta.total,
    bookings: bookings.meta.total
  };
}
