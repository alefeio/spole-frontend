import type { Arena, ArenaSpace } from "@/features/arenas/types";
import type { ReservationListItem } from "@/features/reservations/types";

export type CreateArenaResponse = {
  id: string;
  name: string;
  status: string;
};

export type CreateArenaPayload = {
  name: string;
  description?: string;
  phone: string;
  email: string;
  document: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
  };
  policy: {
    allowRecurring: boolean;
    minAdvanceHours: number;
    minReservationPaymentPercent: number;
  };
};

export type PatchArenaPayload = {
  name?: string;
  description?: string | null;
  phone?: string;
  email?: string;
  document?: string;
  status?: "ACTIVE" | "INACTIVE";
  address?: Partial<CreateArenaPayload["address"]>;
  policy?: Partial<CreateArenaPayload["policy"]>;
};

export type ArenaReservationListItem = ReservationListItem;

export type { Arena, ArenaSpace };
