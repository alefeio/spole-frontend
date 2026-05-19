"use client";

import { useMe } from "@/features/auth/hooks";
import { AccessDenied } from "@/components/feedback/access-denied";
import { LoadingState } from "@/components/feedback/loading-state";

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const { data, isLoading, isFetched } = useMe();

  if (isLoading || !isFetched) {
    return <LoadingState label="Verificando permissões…" />;
  }

  if (!data || data.role !== "admin") {
    return (
      <AccessDenied
        title="Acesso negado"
        description="Esta área é restrita a administradores da plataforma."
      />
    );
  }

  return <>{children}</>;
}
