import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { normalizeAdminMeta } from "@/features/admin/utils";
import type { AdminListResponse } from "@/features/admin/types";
import type {
  AdminUserDetail,
  AdminUserListItem,
  AdminUsersListParams,
  PatchAdminUserStatusPayload
} from "@/features/admin-users/types";

export async function listAdminUsers(
  params: AdminUsersListParams = {}
): Promise<AdminListResponse<AdminUserListItem>> {
  const { data, meta } = await apiClient<AdminUserListItem[]>(endpoints.admin.users.list, {
    query: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      role: params.role,
      email: params.email
    }
  });

  return { data, meta: normalizeAdminMeta(meta, params, data.length) };
}

export async function getAdminUserById(userId: string): Promise<AdminUserDetail> {
  const { data } = await apiClient<AdminUserDetail>(endpoints.admin.users.detail(userId));
  return data;
}

export async function patchAdminUserStatus(
  userId: string,
  payload: PatchAdminUserStatusPayload
): Promise<{ id: string; status: string }> {
  const { data } = await apiClient<{ id: string; status: string }>(
    endpoints.admin.users.updateStatus(userId),
    { method: "PATCH", body: payload }
  );
  return data;
}
