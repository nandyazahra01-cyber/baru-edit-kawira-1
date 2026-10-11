import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import type { AuthUser, Role } from "../types.js";

const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET harus minimal 32 karakter");
  return value;
};

export function signAccessToken(user: AuthUser) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    secret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "30m", issuer: "kawira-api", audience: "kawira-web" }
  );
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "AUTH_REQUIRED" });
    const token = header.slice(7);
    const payload = jwt.verify(token, secret(), { issuer: "kawira-api", audience: "kawira-web" }) as jwt.JwtPayload;
    if (!payload.sub) return res.status(401).json({ error: "INVALID_TOKEN" });

    // Role/status selalu diambil lagi dari database agar perubahan admin langsung berlaku.
    const result = await pool.query(
      `SELECT id, email, name, role, status FROM users WHERE id = $1`,
      [payload.sub]
    );
    const row = result.rows[0] as AuthUser | undefined;
    if (!row || row.status !== "active") return res.status(403).json({ error: "ACCOUNT_NOT_ACTIVE" });
    req.user = row;
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_OR_EXPIRED_TOKEN" });
  }
}

export function allowRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "FORBIDDEN" });
    }
    next();
  };
}
