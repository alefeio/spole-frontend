import type { AdminListParams } from "@/features/admin/types";

export type AdminUserRole = "user" | "arena_owner" | "admin";
export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
};

export type AdminUsersListParams = AdminListParams & {
  status?: AdminUserStatus;
  role?: AdminUserRole;
  email?: string;
};

export type AdminUserDetail = AdminUserListItem & {
  phone: string | null;
  updatedAt: string;
  counts: {
    reservations: number;
    bookings: number;
    payments: number;
  };
};

export type PatchAdminUserStatusPayload = {
  status: AdminUserStatus;
  reason: string;
};
