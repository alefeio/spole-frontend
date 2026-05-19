"use client";

import { useMe } from "@/features/auth/hooks";

export default function AdminPage() {
  const { data: user } = useMe();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Painel administrativo</h1>
      <p className="text-muted-foreground">
        Bem-vindo{user ? `, ${user.name}` : ""}. Nesta sprint o escopo é apenas proteção por role.
        CRUD de categorias virá em sprint futura.
      </p>
    </div>
  );
}
