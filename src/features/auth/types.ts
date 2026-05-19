export type UserRole = "user" | "arena_owner" | "admin";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type MeResponse = User & {
  status: UserStatus;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = User;
