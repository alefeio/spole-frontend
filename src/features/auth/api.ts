import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  AuthResponse,
  LoginPayload,
  MeResponse,
  RegisterPayload,
  RegisterResponse
} from "@/features/auth/types";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient<AuthResponse>(endpoints.auth.login, {
    method: "POST",
    body: payload,
    token: null
  });
  return data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient<RegisterResponse>(endpoints.auth.register, {
    method: "POST",
    body: payload,
    token: null
  });
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await apiClient<MeResponse>(endpoints.users.me);
  return data;
}
