export type UserRole = "ROLE_USER" | "ROLE_ADMIN";
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  roles: UserRole[];
  locked?: boolean;
  createdAt: string;
  active?: boolean;
}
export interface UpdateUserRequest {
  fullName: string;
  phone: string;
  address?: string;
}
