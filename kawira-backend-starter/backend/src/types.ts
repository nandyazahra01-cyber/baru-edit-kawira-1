export type Role = "mentee" | "mentor" | "admin";
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: "active" | "blocked" | "pending";
}
declare global {
  namespace Express {
    interface Request { user?: AuthUser; }
  }
}
