"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMe } from "@/features/auth/hooks";
import { LoadingState } from "@/components/feedback/loading-state";
import { hasToken } from "@/lib/auth/token";

type AuthGuestGuardProps = {
  children: React.ReactNode;
};

/** Redireciona usuários já autenticados para o dashboard. */
export function AuthGuestGuard({ children }: AuthGuestGuardProps) {
  const router = useRouter();
  const tokenPresent = hasToken();
  const { data, isLoading, isSuccess } = useMe();

  useEffect(() => {
    if (tokenPresent && isSuccess && data) {
      router.replace("/dashboard");
    }
  }, [tokenPresent, isSuccess, data, router]);

  if (tokenPresent && (isLoading || isSuccess)) {
    return <LoadingState label="Redirecionando…" />;
  }

  return <>{children}</>;
}
