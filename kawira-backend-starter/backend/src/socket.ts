import type { Server as HttpServer } from "node:http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { pool } from "./db.js";
import type { AuthUser } from "./types.js";

const online = new Map<string, Set<string>>();

export function attachSocketServer(httpServer: HttpServer, clientOrigin: string) {
  const io = new Server(httpServer, {
    cors: { origin: clientOrigin, methods: ["GET", "POST"] },
    maxHttpBufferSize: 1e6
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== "string") return next(new Error("AUTH_REQUIRED"));
      const secret = process.env.JWT_SECRET;
      if (!secret || secret.length < 32) return next(new Error("SERVER_AUTH_CONFIG_ERROR"));
      const payload = jwt.verify(token, secret, { issuer: "kawira-api", audience: "kawira-web" }) as jwt.JwtPayload;
      const result = await pool.query(
        `SELECT id, email, name, role, status FROM users WHERE id=$1`,
        [payload.sub]
      );
      const user = result.rows[0] as AuthUser | undefined;
      if (!user || user.status !== "active") return next(new Error("ACCOUNT_NOT_ACTIVE"));
      socket.data.user = user;
      next();
    } catch {
      next(new Error("INVALID_TOKEN"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as AuthUser;
    const userSockets = online.get(user.id) ?? new Set<string>();
    userSockets.add(socket.id);
    online.set(user.id, userSockets);
    io.emit("presence:update", { userId: user.id, online: true });

    socket.on("conversation:join", async ({ conversationId }: { conversationId?: string }) => {
      if (!conversationId) return;
      const result = await pool.query(
        `SELECT id FROM chat_conversations WHERE id=$1 AND status='active'
         AND (mentee_id=$2 OR mentor_id=$2)`,
        [conversationId, user.id]
      );
      if (result.rowCount) socket.join(`conversation:${conversationId}`);
    });

    socket.on("message:send", async (payload: { conversationId?: string; text?: string }) => {
      try {
        const conversationId = payload?.conversationId;
        const text = payload?.text?.trim();
        if (!conversationId || !text || text.length > 5000) {
          socket.emit("message:error", { error: "INVALID_MESSAGE" });
          return;
        }
        const c = await pool.query(
          `SELECT id, mentee_id, mentor_id FROM chat_conversations
           WHERE id=$1 AND status='active' AND (mentee_id=$2 OR mentor_id=$2)`,
          [conversationId, user.id]
        );
        if (!c.rowCount) {
          socket.emit("message:error", { error: "FORBIDDEN" });
          return;
        }
        const conv = c.rows[0];
        const receiverId = user.id === conv.mentee_id ? conv.mentor_id : conv.mentee_id;
        const saved = await pool.query(
          `INSERT INTO chat_messages (conversation_id, sender_id, receiver_id, message_text)
           VALUES ($1, $2, $3, $4)
           RETURNING id, conversation_id, sender_id, receiver_id, message_text, created_at`,
          [conversationId, user.id, receiverId, text]
        );
        await pool.query(`UPDATE chat_conversations SET last_message_at=now(), updated_at=now() WHERE id=$1`, [conversationId]);
        await pool.query(
          `INSERT INTO activity_logs (user_id, role, action, description, status, metadata)
           VALUES ($1, $2, 'chat.message_sent', 'Pesan chat terkirim', 'success', $3::jsonb)`,
          [user.id, user.role, JSON.stringify({ conversationId })]
        );
        io.to(`conversation:${conversationId}`).emit("message:new", saved.rows[0]);
        socket.emit("message:sent", { id: saved.rows[0].id });
      } catch {
        socket.emit("message:error", { error: "MESSAGE_SEND_FAILED" });
      }
    });

    socket.on("message:read", async ({ conversationId }: { conversationId?: string }) => {
      if (!conversationId) return;
      const c = await pool.query(
        `SELECT id FROM chat_conversations WHERE id=$1 AND (mentee_id=$2 OR mentor_id=$2)`,
        [conversationId, user.id]
      );
      if (!c.rowCount) return;
      await pool.query(
        `UPDATE chat_messages SET read_at=now()
         WHERE conversation_id=$1 AND receiver_id=$2 AND read_at IS NULL`,
        [conversationId, user.id]
      );
      io.to(`conversation:${conversationId}`).emit("message:read", { conversationId, readerId: user.id });
    });

    socket.on("chat:finish", async ({ conversationId, summary }: { conversationId?: string; summary?: string }) => {
      if (user.role !== "mentor" || !conversationId || !summary?.trim() || summary.length > 5000) return;
      const r = await pool.query(
        `UPDATE chat_conversations SET status='completed', summary=$3, completed_at=now(), updated_at=now()
         WHERE id=$1 AND mentor_id=$2 AND status='active' RETURNING id, status, summary, completed_at`,
        [conversationId, user.id, summary.trim()]
      );
      if (!r.rowCount) return;
      await pool.query(
        `INSERT INTO activity_logs (user_id, role, action, description, status, metadata)
         VALUES ($1, 'mentor', 'chat.finished', 'Sesi chat diselesaikan', 'success', $2::jsonb)`,
        [user.id, JSON.stringify({ conversationId })]
      );
      io.to(`conversation:${conversationId}`).emit("chat:finished", r.rows[0]);
    });

    socket.on("disconnect", () => {
      const sockets = online.get(user.id);
      sockets?.delete(socket.id);
      if (!sockets?.size) {
        online.delete(user.id);
        io.emit("presence:update", { userId: user.id, online: false });
      }
    });
  });

  return io;
}
