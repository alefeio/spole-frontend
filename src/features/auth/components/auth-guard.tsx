"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMe } from "@/features/auth/hooks";
import { LoadingState } from "@/components/feedback/loading-state";
import { AccessDenied } from "@/components/feedback/access-denied";
import { hasToken } from "@/lib/auth/token";
import { ApiError } from "@/lib/api/errors";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const tokenPresent = hasToken();
  const { data, isLoading, isError, error, isFetched } = useMe();

  useEffect(() => {
    if (!tokenPresent) {
      router.replace("/login");
    }
  }, [tokenPresent, router]);

  if (!tokenPresent) {
    return <LoadingState label="Redirecionando…" />;
  }

  if (isLoading || !isFetched) {
    return <LoadingState label="Verificando sessão…" />;
  }

  if (isError && error instanceof ApiError && error.status === 403) {
    return (
      <AccessDenied
        title="Acesso negado"
        description="Sua conta não pode acessar esta área no momento."
      />
    );
  }

  if (isError || !data) {
    return <LoadingState label="Redirecionando…" />;
  }

  return <>{children}</>;
}
