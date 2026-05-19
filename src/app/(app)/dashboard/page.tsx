"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks";

const ROLE_LABELS: Record<string, string> = {
  user: "Participante",
  arena_owner: "Dono de arena",
  admin: "Administrador"
};

export default function DashboardPage() {
  const { data: user } = useMe();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Olá{user ? `, ${user.name}` : ""}! Esta é sua área logada no Spolê.
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

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/account">Minha conta</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/events">Explorar eventos</Link>
        </Button>
        {user?.role === "admin" ? (
          <Button asChild>
            <Link href="/admin">Painel admin</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
