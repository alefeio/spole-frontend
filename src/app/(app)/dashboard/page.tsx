"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";
import { useMyBookings } from "@/features/bookings/hooks";
import { useMyNotifications } from "@/features/notifications/hooks";
import { useMyParticipants } from "@/features/participants/hooks";
import { useMyPayments } from "@/features/payments/hooks";
import { useMyReservations } from "@/features/reservations/hooks";

const ROLE_LABELS: Record<string, string> = {
  user: "Participante",
  arena_owner: "Dono de arena",
  admin: "Administrador"
};

export default function DashboardPage() {
  const { data: user } = useMe();
  const participantsQuery = useMyParticipants();
  const bookingsQuery = useMyBookings({ page: 1, limit: 3 });
  const paymentsQuery = useMyPayments({ page: 1, limit: 3 });
  const notificationsQuery = useMyNotifications({ page: 1, limit: 3 });
  const reservationsQuery = useMyReservations();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Olá{user ? `, ${user.name}` : ""}! Acompanhe inscrições, reservas de quadra e pagamentos
          em um só painel.
        </p>
      </header>

      {user ? (
        <dl className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Perfil</dt>
            <dd className="font-medium">{ROLE_LABELS[user.role] ?? user.role}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">{user.status}</dd>
          </div>
        </dl>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <DashboardCard
          title="Reservas de arena"
          value={reservationsQuery.data?.length ?? 0}
          href="/account/reservations"
        />
        <DashboardCard
          title="Inscrições gratuitas"
          value={participantsQuery.data?.length ?? 0}
          href="/account/bookings"
        />
        <DashboardCard
          title="Reservas pagas"
          value={bookingsQuery.data?.meta.total ?? 0}
          href="/account/bookings"
        />
        <DashboardCard
          title="Pagamentos"
          value={paymentsQuery.data?.meta.total ?? 0}
          href="/account/payments"
        />
        <DashboardCard
          title="Notificações"
          value={notificationsQuery.data?.meta.total ?? 0}
          href="/account/notifications"
        />
      </section>

      <div className="grid gap-3 sm:flex sm:flex-wrap">
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/account">Minha conta</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/account/reservations">Minhas reservas</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/events">Explorar eventos</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 sm:min-h-9">
          <Link href="/arenas">Arenas</Link>
        </Button>
        {user?.role === "admin" ? (
          <Button asChild className="min-h-11 sm:min-h-9">
            <Link href="/admin">Painel admin</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function DashboardCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="hover:bg-muted/40 rounded-xl border p-4 transition-colors">
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  );
}
