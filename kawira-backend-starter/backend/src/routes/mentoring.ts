import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { audit } from "../utils/audit.js";

export const mentoringRouter = Router();
mentoringRouter.use(requireAuth);

mentoringRouter.get("/", async (req, res) => {
  const { id, role } = req.user!;
  let result;
  if (role === "mentee") {
    result = await pool.query(
      `SELECT s.*, u.name AS mentor_name FROM mentoring_sessions s
       JOIN users u ON u.id=s.mentor_id WHERE s.mentee_id=$1 ORDER BY s.scheduled_at DESC`,
      [id]
    );
  } else if (role === "mentor") {
    result = await pool.query(
      `SELECT s.*, u.name AS mentee_name FROM mentoring_sessions s
       JOIN users u ON u.id=s.mentee_id WHERE s.mentor_id=$1 ORDER BY s.scheduled_at DESC`,
      [id]
    );
  } else {
    result = await pool.query(
      `SELECT s.*, m.name AS mentee_name, n.name AS mentor_name
       FROM mentoring_sessions s JOIN users m ON m.id=s.mentee_id JOIN users n ON n.id=s.mentor_id
       ORDER BY s.scheduled_at DESC LIMIT 500`
    );
  }
  res.json({ sessions: result.rows });
});

mentoringRouter.post("/", async (req, res) => {
  if (req.user!.role !== "mentee") return res.status(403).json({ error: "MENTEE_ONLY" });
  const parsed = z.object({
    mentorId: z.string().uuid(),
    scheduledAt: z.string().datetime(),
    notes: z.string().max(2000).optional()
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT", details: parsed.error.flatten() });

  const mentor = await pool.query(
    `SELECT u.id FROM users u JOIN mentor_profiles p ON p.user_id=u.id
     WHERE u.id=$1 AND u.role='mentor' AND u.status='active' AND p.approval_status='approved'`,
    [parsed.data.mentorId]
  );
  if (!mentor.rowCount) return res.status(404).json({ error: "MENTOR_NOT_AVAILABLE" });

  const r = await pool.query(
    `INSERT INTO mentoring_sessions (mentee_id, mentor_id, scheduled_at, notes)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [req.user!.id, parsed.data.mentorId, parsed.data.scheduledAt, parsed.data.notes ?? null]
  );
  await audit(req, "mentoring.requested", "Pengajuan sesi mentoring", "success", { sessionId: r.rows[0].id });
  res.status(201).json({ session: r.rows[0] });
});

mentoringRouter.patch("/:id/status", async (req, res) => {
  if (req.user!.role !== "mentor" && req.user!.role !== "admin") return res.status(403).json({ error: "FORBIDDEN" });
  const parsed = z.object({ status: z.enum(["approved", "completed", "cancelled", "in_progress"]) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });
  const args = [req.params.id, parsed.data.status, req.user!.id];
  const query = req.user!.role === "admin"
    ? `UPDATE mentoring_sessions SET status=$2, updated_at=now() WHERE id=$1 RETURNING *`
    : `UPDATE mentoring_sessions SET status=$2, updated_at=now() WHERE id=$1 AND mentor_id=$3 RETURNING *`;
  const r = await pool.query(query, args);
  if (!r.rowCount) return res.status(404).json({ error: "SESSION_NOT_FOUND" });
  await audit(req, `mentoring.${parsed.data.status}`, "Status sesi mentoring diperbarui", "success", { sessionId: req.params.id });
  res.json({ session: r.rows[0] });
});
