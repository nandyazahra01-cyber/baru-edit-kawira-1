import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { audit } from "../utils/audit.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, allowRoles("admin"));

adminRouter.get("/activity-logs", async (req, res) => {
  const parsed = z.object({
    role: z.enum(["mentee", "mentor", "admin"]).optional(),
    action: z.string().max(100).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    limit: z.coerce.number().int().min(1).max(200).default(50),
    offset: z.coerce.number().int().min(0).default(0)
  }).safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_FILTER" });
  const f = parsed.data;
  const r = await pool.query(
    `SELECT id, user_id, role, action, description, ip_address, user_agent, status, metadata, created_at
     FROM activity_logs
     WHERE ($1::text IS NULL OR role=$1)
       AND ($2::text IS NULL OR action=$2)
       AND ($3::timestamptz IS NULL OR created_at >= $3)
       AND ($4::timestamptz IS NULL OR created_at <= $4)
     ORDER BY created_at DESC LIMIT $5 OFFSET $6`,
    [f.role ?? null, f.action ?? null, f.from ?? null, f.to ?? null, f.limit, f.offset]
  );
  res.json({ logs: r.rows, limit: f.limit, offset: f.offset });
});

adminRouter.get("/metrics", async (_req, res) => {
  const r = await pool.query(
    `WITH days AS (
       SELECT generate_series(current_date - interval '6 days', current_date, interval '1 day')::date AS day
     )
     SELECT days.day,
       (SELECT count(DISTINCT al.user_id)::int FROM activity_logs al
        WHERE al.created_at >= days.day AND al.created_at < days.day + interval '1 day') AS active_users,
       (SELECT count(*)::int FROM mentoring_sessions ms
        WHERE ms.status='completed' AND ms.updated_at >= days.day AND ms.updated_at < days.day + interval '1 day') AS mentoring_completed,
       (SELECT count(*)::int FROM chat_messages cm
        WHERE cm.created_at >= days.day AND cm.created_at < days.day + interval '1 day') AS messages_sent
     FROM days ORDER BY days.day`
  );
  res.json({ daily: r.rows });
});

adminRouter.get("/users", async (req, res) => {
  const parsed = z.object({
    role: z.enum(["mentee", "mentor", "admin"]).optional(),
    status: z.enum(["active", "blocked", "pending"]).optional(),
    q: z.string().max(100).optional(),
    limit: z.coerce.number().int().min(1).max(200).default(50)
  }).safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_FILTER" });
  const f = parsed.data;
  const r = await pool.query(
    `SELECT id, name, email, role, status, created_at FROM users
     WHERE ($1::text IS NULL OR role=$1)
       AND ($2::text IS NULL OR status=$2)
       AND ($3::text IS NULL OR name ILIKE '%' || $3 || '%' OR email ILIKE '%' || $3 || '%')
     ORDER BY created_at DESC LIMIT $4`,
    [f.role ?? null, f.status ?? null, f.q ?? null, f.limit]
  );
  res.json({ users: r.rows });
});

adminRouter.patch("/users/:id/status", async (req, res) => {
  const parsed = z.object({ status: z.enum(["active", "blocked", "pending"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_STATUS" });
  if (req.params.id === req.user!.id) return res.status(400).json({ error: "CANNOT_CHANGE_OWN_STATUS" });
  const r = await pool.query(
    `UPDATE users SET status=$2, updated_at=now() WHERE id=$1
     RETURNING id, name, email, role, status`,
    [req.params.id, parsed.data.status]
  );
  if (!r.rowCount) return res.status(404).json({ error: "USER_NOT_FOUND" });
  await audit(req, "admin.user_status_changed", "Admin mengubah status user", "success",
    { targetUserId: req.params.id, newStatus: parsed.data.status });
  res.json({ user: r.rows[0] });
});

adminRouter.patch("/mentors/:id/approval", async (req, res) => {
  const parsed = z.object({ approvalStatus: z.enum(["approved", "rejected", "pending"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_APPROVAL_STATUS" });
  const r = await pool.query(
    `UPDATE mentor_profiles SET approval_status=$2, updated_at=now()
     WHERE user_id=$1 RETURNING user_id, approval_status`,
    [req.params.id, parsed.data.approvalStatus]
  );
  if (!r.rowCount) return res.status(404).json({ error: "MENTOR_PROFILE_NOT_FOUND" });
  await audit(req, "admin.mentor_approval_changed", "Admin memperbarui persetujuan mentor", "success",
    { mentorId: req.params.id, approvalStatus: parsed.data.approvalStatus });
  res.json({ mentor: r.rows[0] });
});
