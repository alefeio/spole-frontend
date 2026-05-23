"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AdminFilterField,
  AdminFiltersBar,
  adminInputClassName,
  adminSelectClassName
} from "@/features/admin/components/admin-filters-bar";
import { AdminListShell } from "@/features/admin/components/admin-list-shell";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { useAdminPayments } from "@/features/admin-payments/hooks";
import type { AdminPaymentsListParams } from "@/features/admin-payments/types";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import type { PaymentStatus } from "@/features/payments/types";
import {
  ADMIN_DEFAULT_LIMIT,
  buildAdminQueryString,
  formatAdminDateTime,
  formatAdminMoney,
  parsePositiveInt
} from "@/features/admin/utils";

const BASE = "/admin/payments";

function parseParams(searchParams: URLSearchParams): AdminPaymentsListParams {
  const status = searchParams.get("status");
  return {
    page: parsePositiveInt(searchParams.get("page"), 1),
    limit: parsePositiveInt(searchParams.get("limit"), ADMIN_DEFAULT_LIMIT),
    status:
      status === "PENDING" || status === "PAID" || status === "FAILED" || status === "CANCELLED"
        ? (status as PaymentStatus)
        : undefined,
    userId: searchParams.get("userId") || undefined,
    bookingId: searchParams.get("bookingId") || undefined,
    reservationId: searchParams.get("reservationId") || undefined
  };
}

export function AdminPaymentsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseParams(searchParams), [searchParams]);
  const query = useAdminPayments(params);

  function updateUrl(next: Partial<AdminPaymentsListParams>) {
    router.push(
      buildAdminQueryString(BASE, { ...params, ...next }, { page: 1, limit: ADMIN_DEFAULT_LIMIT })
    );
  }

  const hasFilters = Boolean(
    params.status || params.userId || params.bookingId || params.reservationId
  );

  return (
    <div className="space-y-6 overflow-x-hidden">
      <AdminPageHeader title="Pagamentos" description="Listagem operacional somente leitura." />

      <AdminFiltersBar hasFilters={hasFilters} onClear={() => router.push(BASE)}>
        <AdminFilterField label="Usuário (ID)" htmlFor="admin-pay-user">
          <input
            id="admin-pay-user"
            className={adminInputClassName}
            defaultValue={params.userId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.userId ?? "")) updateUrl({ userId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Booking (ID)" htmlFor="admin-pay-booking">
          <input
            id="admin-pay-booking"
            className={adminInputClassName}
            defaultValue={params.bookingId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.bookingId ?? "")) updateUrl({ bookingId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Reserva (ID)" htmlFor="admin-pay-res">
          <input
            id="admin-pay-res"
            className={adminInputClassName}
            defaultValue={params.reservationId ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (params.reservationId ?? ""))
                updateUrl({ reservationId: v || undefined, page: 1 });
            }}
          />
        </AdminFilterField>
        <AdminFilterField label="Status" htmlFor="admin-pay-status">
          <select
            id="admin-pay-status"
            className={adminSelectClassName}
            value={params.status ?? ""}
            onChange={(e) =>
              updateUrl({
                status: (e.target.value || undefined) as PaymentStatus | undefined,
                page: 1
              })
            }
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="PAID">Pago</option>
            <option value="FAILED">Falhou</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </AdminFilterField>
      </AdminFiltersBar>

      <AdminListShell
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        isSuccess={query.isSuccess}
        items={query.data?.data ?? []}
        meta={query.data?.meta}
        hasFilters={hasFilters}
        onRetry={() => void query.refetch()}
        onClearFilters={() => router.push(BASE)}
        onPageChange={(page) => updateUrl({ page })}
      >
        <ul className="space-y-3">
          {(query.data?.data ?? []).map((payment) => (
            <li key={payment.id}>
              <article className="space-y-3 rounded-xl border p-4">
                <PaymentStatusBadge status={payment.status} />
                <p className="text-lg font-semibold">{formatAdminMoney(payment.grossAmount)}</p>
                <p className="font-mono text-xs break-all">Usuário: {payment.userId}</p>
                {payment.bookingId ? (
                  <p className="font-mono text-xs break-all">Booking: {payment.bookingId}</p>
                ) : null}
                {payment.reservationId ? (
                  <p className="font-mono text-xs break-all">Reserva: {payment.reservationId}</p>
                ) : null}
                <p className="text-muted-foreground text-xs">
                  Pago: {formatAdminDateTime(payment.paidAt)} · Criado:{" "}
                  {formatAdminDateTime(payment.createdAt)}
                </p>
                <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                  <Link href={`${BASE}/${payment.id}`}>Ver detalhe</Link>
                </Button>
              </article>
            </li>
          ))}
        </ul>
      </AdminListShell>
    </div>
  );
}
