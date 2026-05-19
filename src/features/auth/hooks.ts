"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, login, register } from "@/features/auth/api";
import { authKeys } from "@/features/auth/keys";
import type { LoginPayload, RegisterPayload } from "@/features/auth/types";
import { hasToken, removeToken, setToken } from "@/lib/auth/token";
import { ApiError } from "@/lib/api/errors";

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled: hasToken(),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }
      return failureCount < 1;
    }
  });
}

export function useLogin(redirectTo = "/dashboard") {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setToken(data.token);
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
      router.replace(redirectTo);
    }
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      router.replace("/login?registered=1");
    }
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    queryClient.removeQueries({ queryKey: authKeys.all });
    router.replace("/login");
  };
}
