export type Role = "student" | "admin";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

export type JwtPayload = AuthUser;
