import type { User } from "../../users/types/user.type";

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
export interface RefreshTokenRequest {
  refreshToken: string;
}
export interface LogoutRequest {
  accessToken: string;
  refreshToken: string;
}
export interface IntrospectRequest {
  accessToken: string;
}
export interface IntrospectResponse {
  valid: boolean;
}
export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface RegisterResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  roles: string[];
  createdAt: string;
}
