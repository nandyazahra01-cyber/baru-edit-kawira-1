import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { audit } from "../utils/audit.js";

export const chatRouter = Router();
chatRouter.use(requireAuth);

async function canAccessConversation(conversationId: string, userId: string) {
  const r = await pool.query(
    `SELECT id FROM chat_conversations
     WHERE id = $1 AND (mentee_id = $2 OR mentor_id = $2) AND status = 'active'`,
    [conversationId, userId]
  );
  return r.rowCount === 1;
}

chatRouter.post("/conversations", async (req, res) => {
  if (req.user!.role !== "mentee") return res.status(403).json({ error: "MENTEE_ONLY" });
  const parsed = z.object({ mentorId: z.string().uuid() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });
  const { mentorId } = parsed.data;
  const mentor = await pool.query(
    `SELECT u.id FROM users u JOIN mentor_profiles mp ON mp.user_id = u.id
     WHERE u.id = $1 AND u.role = 'mentor' AND u.status = 'active' AND mp.approval_status = 'approved'`,
    [mentorId]
  );
  if (!mentor.rowCount) return res.status(404).json({ error: "MENTOR_NOT_AVAILABLE" });

  // Percakapan hanya dapat dibuat jika ada relasi mentoring yang disetujui/aktif.
  const linked = await pool.query(
    `SELECT id FROM mentoring_sessions
     WHERE mentee_id = $1 AND mentor_id = $2 AND status IN ('approved','in_progress','completed')
     LIMIT 1`,
    [req.user!.id, mentorId]
  );
  if (!linked.rowCount) return res.status(403).json({ error: "MENTORING_RELATION_REQUIRED" });

  const r = await pool.query(
    `INSERT INTO chat_conversations (mentee_id, mentor_id)
     VALUES ($1, $2)
     ON CONFLICT (mentee_id, mentor_id) WHERE status = 'active'
     DO UPDATE SET updated_at = now()
     RETURNING id, mentee_id, mentor_id, status, created_at`,
    [req.user!.id, mentorId]
  );
  await audit(req, "chat.conversation_opened", "Percakapan dibuka", "success", { conversationId: r.rows[0].id });
  res.status(201).json({ conversation: r.rows[0] });
});

chatRouter.get("/conversations", async (req, res) => {
  const isMentee = req.user!.role === "mentee";
  const column = isMentee ? "c.mentee_id" : "c.mentor_id";
  const r = await pool.query(
    `SELECT c.id, c.mentee_id, c.mentor_id, c.status, c.last_message_at, c.updated_at,
            m.message_text AS last_message,
            (SELECT count(*)::int FROM chat_messages unread
             WHERE unread.conversation_id = c.id AND unread.receiver_id = $1 AND unread.read_at IS NULL) AS unread_count
     FROM chat_conversations c
     LEFT JOIN LATERAL (
       SELECT message_text FROM chat_messages
       WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1
     ) m ON true
     WHERE ${column} = $1
     ORDER BY c.updated_at DESC`,
    [req.user!.id]
  );
  res.json({ conversations: r.rows });
});

chatRouter.get("/conversations/:id/messages", async (req, res) => {
  if (!(await canAccessConversation(req.params.id, req.user!.id))) return res.status(403).json({ error: "FORBIDDEN" });
  const r = await pool.query(
    `SELECT id, conversation_id, sender_id, receiver_id, message_text, attachment_url, read_at, created_at
     FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 500`,
    [req.params.id]
  );
  res.json({ messages: r.rows });
});

chatRouter.post("/conversations/:id/messages", async (req, res) => {
  if (!(await canAccessConversation(req.params.id, req.user!.id))) return res.status(403).json({ error: "FORBIDDEN" });
  const parsed = z.object({
    text: z.string().trim().min(1).max(5000),
    attachmentUrl: z.string().url().max(2000).optional()
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });
  const c = await pool.query(`SELECT mentee_id, mentor_id FROM chat_conversations WHERE id=$1`, [req.params.id]);
  const conv = c.rows[0];
  const receiverId = req.user!.id === conv.mentee_id ? conv.mentor_id : conv.mentee_id;
  const r = await pool.query(
    `INSERT INTO chat_messages (conversation_id, sender_id, receiver_id, message_text, attachment_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, conversation_id, sender_id, receiver_id, message_text, attachment_url, created_at`,
    [req.params.id, req.user!.id, receiverId, parsed.data.text, parsed.data.attachmentUrl ?? null]
  );
  await pool.query(`UPDATE chat_conversations SET last_message_at=now(), updated_at=now() WHERE id=$1`, [req.params.id]);
  await audit(req, "chat.message_sent", "Pesan chat dikirim", "success", { conversationId: req.params.id });
  res.status(201).json({ message: r.rows[0] });
});

chatRouter.post("/conversations/:id/finish", async (req, res) => {
  if (req.user!.role !== "mentor") return res.status(403).json({ error: "MENTOR_ONLY" });
  const parsed = z.object({ summary: z.string().trim().min(1).max(5000) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });
  if (!(await canAccessConversation(req.params.id, req.user!.id))) return res.status(403).json({ error: "FORBIDDEN" });
  const r = await pool.query(
    `UPDATE chat_conversations SET status='completed', summary=$2, completed_at=now(), updated_at=now()
     WHERE id=$1 AND mentor_id=$3 RETURNING id, status, summary, completed_at`,
    [req.params.id, parsed.data.summary, req.user!.id]
  );
  if (!r.rowCount) return res.status(403).json({ error: "FORBIDDEN" });
  await audit(req, "chat.finished", "Sesi chat diselesaikan", "success", { conversationId: req.params.id });
  res.json({ conversation: r.rows[0] });
});
