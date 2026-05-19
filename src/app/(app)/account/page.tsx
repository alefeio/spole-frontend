"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { useMyBookings } from "@/features/bookings/hooks";
import { useMyNotifications } from "@/features/notifications/hooks";
import { useMyParticipants } from "@/features/participants/hooks";
import { useMyPayments } from "@/features/payments/hooks";

const ROLE_LABELS: Record<string, string> = {
  user: "Participante",
  arena_owner: "Dono de arena",
  admin: "Administrador"
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  INACTIVE: "Inativa"
};

export default function AccountPage() {
  const { data: user } = useMe();
  const participantsQuery = useMyParticipants();
  const bookingsQuery = useMyBookings({ page: 1, limit: 3 });
  const paymentsQuery = useMyPayments({ page: 1, limit: 3 });
  const notificationsQuery = useMyNotifications({ page: 1, limit: 3 });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Minha conta</h1>
        <p className="text-muted-foreground text-sm">
          Dados da sua conta (somente leitura). Edição de perfil aguarda suporte no backend.
        </p>
      </header>

      <section className="rounded-lg border">
        <dl className="divide-y">
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-3">
            <dt className="text-muted-foreground text-sm">Nome</dt>
            <dd className="font-medium sm:col-span-2">{user.name}</dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-3">
            <dt className="text-muted-foreground text-sm">E-mail</dt>
            <dd className="font-medium sm:col-span-2">{user.email}</dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-3">
            <dt className="text-muted-foreground text-sm">Perfil</dt>
            <dd className="font-medium sm:col-span-2">{ROLE_LABELS[user.role] ?? user.role}</dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-3">
            <dt className="text-muted-foreground text-sm">Status</dt>
            <dd className="font-medium sm:col-span-2">
              {STATUS_LABELS[user.status] ?? user.status}
            </dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-3">
            <dt className="text-muted-foreground text-sm">ID</dt>
            <dd className="text-muted-foreground font-mono text-xs break-all sm:col-span-2">
              {user.id}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Inscrições"
          value={participantsQuery.data?.length ?? 0}
          description={`${bookingsQuery.data?.meta.total ?? 0} reservas pagas`}
          href="/account/bookings"
        />
        <SummaryCard
          title="Pagamentos"
          value={paymentsQuery.data?.meta.total ?? 0}
          description="Histórico financeiro"
          href="/account/payments"
        />
        <SummaryCard
          title="Notificações"
          value={notificationsQuery.data?.meta.total ?? 0}
          description="Avisos da conta"
          href="/account/notifications"
        />
      </section>

      <section className="grid gap-3 sm:flex sm:flex-wrap">
        <Button asChild className="min-h-11 sm:min-h-9">
          <Link href="/account/bookings">Ver inscrições</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/account/payments">Ver pagamentos</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/account/notifications">Ver notificações</Link>
        </Button>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  href
}: {
  title: string;
  value: number;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="hover:bg-muted/40 rounded-xl border p-4 transition-colors">
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </Link>
  );
}
