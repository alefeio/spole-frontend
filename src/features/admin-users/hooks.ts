"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUserById, listAdminUsers, patchAdminUserStatus } from "@/features/admin-users/api";
import type {
  AdminUsersListParams,
  PatchAdminUserStatusPayload
} from "@/features/admin-users/types";
import { adminKeys } from "@/features/admin/hooks";

export const adminUsersKeys = {
  all: [...adminKeys.all, "users"] as const,
  lists: () => [...adminUsersKeys.all, "list"] as const,
  list: (params: AdminUsersListParams) => [...adminUsersKeys.lists(), params] as const,
  details: () => [...adminUsersKeys.all, "detail"] as const,
  detail: (userId: string) => [...adminUsersKeys.details(), userId] as const
};

export function useAdminUsers(params: AdminUsersListParams) {
  return useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => listAdminUsers(params),
    placeholderData: (prev) => prev
  });
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminUsersKeys.detail(userId),
    queryFn: () => getAdminUserById(userId),
    enabled: Boolean(userId)
  });
}

export function usePatchAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: PatchAdminUserStatusPayload }) =>
      patchAdminUserStatus(userId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.hubTotals() });
      void queryClient.invalidateQueries({ queryKey: [...adminKeys.all, "audit"] });
    }
  });
}
