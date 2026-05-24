export type ArenaStatus = "ACTIVE" | "INACTIVE" | string;

export type ArenaAddress = {
  zipCode: string | null;
  street: string | null;
  number: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type ArenaPolicy = {
  allowRecurring: boolean;
  minAdvanceHours: number;
  minReservationPaymentPercent: number;
};

export type Arena = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string;
  email: string;
  document: string;
  status: ArenaStatus;
  createdAt?: string;
  updatedAt?: string;
  address: ArenaAddress;
  policy: ArenaPolicy;
};

export type ArenaSpace = {
  id: string;
  arenaId: string;
  name: string;
  type: string;
  description: string | null;
  capacitySuggestion: number | null;
  status: string;
};

export type PublicArenaListItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  city: string | null;
  state: string | null;
  district: string | null;
  addressName: string;
  createdAt: string;
};

export type PublicArenasListParams = {
  page?: number;
  limit?: number;
  q?: string;
  city?: string;
  state?: string;
  district?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
};

export type PublicArenasListMeta = {
  page: number;
  limit: number;
  total: number;
};

export type PublicArenasListResponse = {
  data: PublicArenaListItem[];
  meta: PublicArenasListMeta;
};
