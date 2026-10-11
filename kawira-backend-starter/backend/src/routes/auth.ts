import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, signAccessToken } from "../middleware/auth.js";
import { audit } from "../utils/audit.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(72),
  businessName: z.string().trim().max(150).optional()
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });
  const { name, email, password, businessName } = parsed.data;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES ($1, lower($2), $3, 'mentee', 'active')
       RETURNING id, name, email, role, status`,
      [name, email, passwordHash]
    );
    const user = result.rows[0];
    await pool.query(
      `INSERT INTO mentee_profiles (user_id, business_name) VALUES ($1, $2)`,
      [user.id, businessName ?? null]
    );
    const token = signAccessToken(user);
    await pool.query(
      `INSERT INTO activity_logs (user_id, role, action, description, status)
       VALUES ($1, 'mentee', 'auth.register', 'Registrasi mentee berhasil', 'success')`,
      [user.id]
    );
    return res.status(201).json({ user, token });
  } catch (error: any) {
    if (error?.code === "23505") return res.status(409).json({ error: "EMAIL_ALREADY_REGISTERED" });
    console.error(error);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(72)
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });
  const email = parsed.data.email.toLowerCase();
  const result = await pool.query(
    `SELECT id, name, email, password_hash, role, status FROM users WHERE email = $1`,
    [email]
  );
  const user = result.rows[0];
  const ok = user ? await bcrypt.compare(parsed.data.password, user.password_hash) : false;
  if (!user || !ok || user.status !== "active") {
    await pool.query(
      `INSERT INTO activity_logs (user_id, role, action, description, status, metadata)
       VALUES ($1, $2, 'auth.login_failed', 'Login gagal', 'failure', $3::jsonb)`,
      [user?.id ?? null, user?.role ?? null, JSON.stringify({ email })]
    );
    return res.status(401).json({ error: "INVALID_CREDENTIALS_OR_INACTIVE_ACCOUNT" });
  }
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status };
  const token = signAccessToken(safeUser);
  await pool.query(
    `INSERT INTO activity_logs (user_id, role, action, description, status)
     VALUES ($1, $2, 'auth.login', 'Login berhasil', 'success')`,
    [user.id, user.role]
  );
  return res.json({ user: safeUser, token });
});

authRouter.get("/me", requireAuth, (req, res) => res.json({ user: req.user }));

authRouter.post("/logout", requireAuth, async (req, res) => {
  // JWT bearer stateless: client wajib menghapus token. Untuk revoke server-side,
  // tambahkan session/token-version table atau gunakan refresh token yang dapat dicabut.
  await pool.query(
    `INSERT INTO activity_logs (user_id, role, action, description, status)
     VALUES ($1, $2, 'auth.logout', 'Logout dari client', 'success')`,
    [req.user!.id, req.user!.role]
  );
  res.json({ ok: true });
});
