"use client";

import Link from "next/link";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminStatCard } from "@/features/admin/components/admin-stat-card";
import { useAdminHubTotals } from "@/features/admin/hooks";

const LINKS = [
  { href: "/admin/users", label: "Usuários", key: "users" as const },
  { href: "/admin/events", label: "Eventos", key: "events" as const },
  { href: "/admin/reservations", label: "Reservas", key: "reservations" as const },
  { href: "/admin/payments", label: "Pagamentos", key: "payments" as const },
  { href: "/admin/arenas", label: "Arenas", key: "arenas" as const },
  { href: "/admin/audit", label: "Auditoria", key: "audit" as const },
  { href: "/admin/bookings", label: "Bookings", key: "bookings" as const }
];

export function AdminHub() {
  const totalsQuery = useAdminHubTotals();

  return (
    <div className="space-y-8 overflow-x-hidden">
      <AdminPageHeader
        title="Administração"
        description="Hub operacional — listagens, detalhes read-only e ações permitidas pela API."
      />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Atalhos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-muted/40 flex min-h-11 items-center rounded-xl border px-4 py-3 font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Totais (API)</h2>
        <p className="text-muted-foreground text-sm">
          Contagens via <code className="text-xs">page=1&amp;limit=1</code> e{" "}
          <code className="text-xs">meta.total</code> — sem métricas inventadas.
        </p>
        {totalsQuery.isError ? (
          <p className="text-muted-foreground text-sm">
            Não foi possível carregar totais. Use os atalhos acima.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LINKS.map((item) => (
              <AdminStatCard
                key={item.key}
                title={item.label}
                href={item.href}
                value={totalsQuery.data?.[item.key] ?? "—"}
                isLoading={totalsQuery.isLoading}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
