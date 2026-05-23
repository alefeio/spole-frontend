import type { AdminListParams } from "@/features/admin/types";
import type { ArenaStatus } from "@/features/arenas/types";

export type AdminArenaListItem = {
  id: string;
  name: string;
  slug: string;
  status: ArenaStatus;
  ownerId: string;
  city: string | null;
  createdAt: string;
};

export type AdminArenasListParams = AdminListParams & {
  status?: "ACTIVE" | "INACTIVE";
  ownerId?: string;
  city?: string;
};

export type PatchAdminArenaStatusPayload = {
  status: "ACTIVE" | "INACTIVE";
  reason: string;
};
