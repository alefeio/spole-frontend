"use client";

import { useMe } from "@/features/auth/hooks";

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

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Minha conta</h1>
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
            <dd className="text-muted-foreground font-mono text-xs sm:col-span-2">{user.id}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
