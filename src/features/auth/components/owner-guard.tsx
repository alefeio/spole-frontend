"use client";

import { useMe } from "@/features/auth/hooks";
import { AccessDenied } from "@/components/feedback/access-denied";
import { LoadingState } from "@/components/feedback/loading-state";

type OwnerGuardProps = {
  children: React.ReactNode;
};

export function OwnerGuard({ children }: OwnerGuardProps) {
  const { data, isLoading, isFetched } = useMe();

  if (isLoading || !isFetched) {
    return <LoadingState label="Verificando permissões…" />;
  }

  if (!data || data.role !== "arena_owner") {
    return (
      <AccessDenied
        title="Acesso negado"
        description="Esta área é restrita a donos de arena. Administradores usam o painel em /admin."
      />
    );
  }

  return <>{children}</>;
}
